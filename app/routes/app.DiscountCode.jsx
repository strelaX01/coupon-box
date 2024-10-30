import {
  FormLayout,
  Select,
  TextField,
  Icon,
  Button,
  Modal,
  Checkbox,
  Page,
  BlockStack,
  InlineGrid,
  Box,
  Card,
  Text,
  InlineStack,
  Image,
  Toast
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { SearchRecentIcon, DeleteIcon } from '@shopify/polaris-icons';
import { useLoaderData, useSubmit } from "@remix-run/react";


export default function DiscountCode() {
  const { products, collections, discountmetafields } = useLoaderData();
  const submit = useSubmit();
  const [selectedDiscountValue, setSelectedDiscountValue] = useState("Percentage");
  const [selectedAppliesTo, setSelectedAppliesTo] = useState("Specific-collections");
  const [discountAmount, setDiscountAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [placeholder, setPlaceholder] = useState("Search");
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [discountAmountError, setDiscountAmountError] = useState("");
  const [activeDateError, setActiveDateError] = useState("");
  const [temporarySelectedItems, setTemporarySelectedItems] = useState([]);
  const [ToastMessage, setToastMessage] = useState("");



  useEffect(() => {
    if (discountmetafields && discountmetafields.discountSettings) {
      const settings = discountmetafields.discountSettings;
  
      setSelectedDiscountValue(settings.discount_type || "Percentage");
      setDiscountAmount(settings.discount_amount || "");
      setActiveDate(settings.active_date ? settings.active_date.toString() : "");
      setSelectedAppliesTo(settings.selectedAppliesTo || "Specific-collections");

      const formattedSelectedItems = [];
      const uniqueIds = new Set();
  
      if (settings.selectedItems) {
        settings.selectedItems.forEach((item) => {
          if (!uniqueIds.has(item.id.trim())) { 
            uniqueIds.add(item.id.trim());
            formattedSelectedItems.push({
              id: item.id.trim(),
              productTitle: item.productTitle?.trim() || "",
              title: item.title?.trim() || "",
              image: item.image || [], 
            });
          }
        });
      }
  
      setSelectedItems(formattedSelectedItems);
    }
  }, [discountmetafields]);
  
  
  

  useEffect(() => {
    if (searchTerm.length >= 2) {
      setModalOpen(true);
      handleSearch(searchTerm);
    } else {
      setItems([]);
    }
  }, [searchTerm]);

  const handleDiscountValue = useCallback((value) => {
    setSelectedDiscountValue(value);
    setDiscountAmount("");
    setDiscountAmountError("");
  }, []);

  const handleActiveDateChange = (value) => {
    if (/^\d*$/.test(value)) {
      setActiveDate(value);
    }
  };

  const handleDiscountAmountChange = (value) => {
    setDiscountAmount(value);
  };

  const handleAppliesToChange = useCallback((value) => {
    setSelectedAppliesTo(value);
    setPlaceholder(value === "Specific-collections" ? "Search for collections" : "Search for products");
    setSearchTerm("");
    setItems([]);

    setSelectedItems([]);
  }, []);


  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleBrowseSubmit = async () => {
    const endpoint = selectedAppliesTo === "Specific-collections"
      ? collections
      : products;

    setItems(endpoint);
    setModalOpen(true);
  };

  const handleSearch = (term) => {
    if (!term) {
      setItems([]);
      return;
    }

    const endpointItems = selectedAppliesTo === "Specific-collections" ? collections : products;

    const filteredItems = endpointItems.filter(item => {
      const title = item.title.toLowerCase();
      return title.includes(term.toLowerCase());
    });

    setItems(filteredItems);
  };

  const handleItemSelect = (id, isVariant = false, parentId = null) => {

    const itemToToggle = items.find(item => {
      if (isVariant && parentId) {
        return item.id === parentId && item.variants?.some(variant => variant.id === id);
      }
      return item.id === id;
    });

    if (!itemToToggle) return;

    const isParentItemWithVariants = !isVariant && itemToToggle.variants && itemToToggle.variants.length > 0;
    const isItemSelected = temporarySelectedItems.some(selectedItem =>
      selectedItem.id === (isVariant ? id : itemToToggle.id)
    );

    let selectedItem = null;

    if (isParentItemWithVariants) {
      selectedItem = {
        id: itemToToggle.id,
        title: itemToToggle.title,
      };
    } else if (isVariant && parentId) {
      const selectedVariant = itemToToggle.variants.find(variant => variant.id === id);
      if (selectedVariant) {
        selectedItem = {
          id: selectedVariant.id,
          title: selectedVariant.title,
          productTitle: itemToToggle.title,
          image: itemToToggle.images,
        };
      }
    } else {
      selectedItem = {
        id: itemToToggle.id,
        title: itemToToggle.title,
      };
    }
    if (!selectedItem) return;

    setTemporarySelectedItems((prevSelected) => {
      let updatedSelectedItems;

      if (isParentItemWithVariants) {
        if (isItemSelected) {
          updatedSelectedItems = prevSelected.filter(item => item.id !== itemToToggle.id);
        } else {
          updatedSelectedItems = [
            ...prevSelected,
            { id: itemToToggle.id, title: itemToToggle.title }
          ];
        }
      } else if (isVariant && parentId) {
        if (isItemSelected) {
          updatedSelectedItems = prevSelected.filter(item => item.id !== selectedItem.id);
        } else {
          updatedSelectedItems = [...prevSelected, selectedItem];
        }
      } else {
        if (isItemSelected) {
          updatedSelectedItems = prevSelected.filter(item => item.id !== selectedItem.id);
        } else {
          updatedSelectedItems = [...prevSelected, selectedItem];
        }
      }

      return updatedSelectedItems;
    });
  };



  const handleModalClose = () => {
    setTemporarySelectedItems([]);
    setModalOpen(false);
  };

  const handleAddItems = () => {
    setSelectedItems((prev) => [
      ...prev,
      ...temporarySelectedItems.filter(item =>
        !prev.some(prevItem => prevItem.id === item.id)
      )
    ]);
    setTemporarySelectedItems([]);
    setModalOpen(false);
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(prev => prev.filter(selectedItem => selectedItem.id !== item.id));
  };

  const handleSave = async () => {
    const allSelectedItems = selectedItems.map(item => {
      if (item.productTitle) {
        return {
          id: item.id,
          type: 'product_variant',
          productTitle: item.productTitle,
          title: item.title,
          image: item.image,
        };
      } else {
        return {
          id: item.id,
          type: 'collection',
          title: item.title,
        };
      }
    });

    const settings = {
      discount_type: selectedDiscountValue,
      discount_amount: discountAmount,
      active_date: parseInt(activeDate),
      selectedAppliesTo: selectedAppliesTo,
      selectedItems: allSelectedItems,
    };
    const settingsType = "discount_code";

    submit({ settingsType, settings: JSON.stringify(settings) }, { method: "post" });
    setToastMessage("Setting saved");


  };

  return (
    <Page
      divider
      primaryAction={{ content: "Save", onAction: handleSave }}
    >
      <BlockStack gap="800">
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart="400" paddingInlineEnd="400">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Discount Type</Text>
              <Text as="p" variant="bodyMd">Choose the type of discount you want to offer.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Select
                label="Discount Type"
                options={[
                  { label: "Percentage", value: "Percentage" },
                  { label: "Fixed amount", value: "Fixed-amount" },
                ]}
                onChange={handleDiscountValue}
                value={selectedDiscountValue}
              />
              <TextField
                label="Discount Amount"
                value={discountAmount}
                onChange={handleDiscountAmountChange}
                prefix={selectedDiscountValue === "Percentage" ? "%" : "$"}
                type="number"
                error={discountAmountError}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart="400" paddingInlineEnd="400">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Applies To</Text>
              <Text as="p" variant="bodyMd">Specify the collections or products this discount applies to.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Select
                label="Applies to"
                options={[
                  { label: "Specific collections", value: "Specific-collections" },
                  { label: "Specific products", value: "Specific-products" },
                ]}
                onChange={handleAppliesToChange}
                value={selectedAppliesTo}
              />
              <InlineGrid columns="3fr 1fr" gap="200">
                <TextField
                  prefix={<Icon source={SearchRecentIcon} />}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={placeholder}
                />
                <Button onClick={handleBrowseSubmit}>Browse</Button>
              </InlineGrid>
              {selectedItems.length > 0 && (
                <Card sectioned>
                  <BlockStack gap="400">
                    {selectedItems.map((item) => {
                      const productTitle = item.productTitle || '';
                      const variantTitle = item.title || '';
                      const imageSrc = item.image && item.image.length > 0 ? item.image[0].src : null; 
                      const imageUri = item.image && item.image.length > 0 ? item.image[0].uri : null;

                      const displayTitle = variantTitle
                        ? ` ${productTitle} ${variantTitle}` : productTitle;

                      return (
                        <InlineStack
                          key={item.id}
                          alignment="center"
                          spacing="tight"
                          style={{ justifyContent: 'space-between' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {imageSrc && (
                              <Image
                                source={imageSrc}
                                alt={displayTitle}
                                style={{
                                  width: '50px',
                                  height: '30px',
                                  objectFit: 'cover',
                                  marginRight: '10px',
                                }}
                              />
                            )}
                            <Text variant="bodyMd" style={{ flex: 1 }}>
                              {displayTitle}
                            </Text>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Button onClick={() => handleRemoveItem(item)} plain>
                              <Icon source={DeleteIcon} color="base" />
                            </Button>
                          </div>
                        </InlineStack>
                      );
                    })}
                  </BlockStack>
                </Card>
              )}



            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart="400" paddingInlineEnd="400">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Active Date</Text>
              <Text as="p" variant="bodyMd">Set the active date for the discount code.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="Active Date"
                value={activeDate}
                onChange={handleActiveDateChange}
                type="number"
                error={activeDateError}
                placeholder="Enter active date (in UNIX timestamp)"
              />
            </BlockStack>
          </Card>
        </InlineGrid>
        {ToastMessage && <Toast content={ToastMessage} onDismiss={() => setToastMessage("")} />}
      </BlockStack>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        title="Browse Collections/Products"
        primaryAction={{
          content: "Add Selected",
          onAction: () => {
            handleAddItems();
          },
        }}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              labelHidden
              placeholder="Search product"
              value={searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
            />

            {items.map((item) => {
              if (!item || !item.id) return null;

              return (
                <BlockStack key={item.id} gap="200">
                  <InlineStack alignment="center" spacing="tight">
                    <InlineStack alignment="center" spacing="tight">
                      {item.images && item.images.length > 0 && (
                        <Image
                          source={item.images[0].src}
                          alt={item.title || item.names}
                          style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 8 }}
                        />
                      )}

                      <Text variant="bodyMd" fontWeight="bold">
                        {item.title}
                      </Text>
                    </InlineStack>
                  </InlineStack>

                  {item.variants && item.variants.length > 0 ? (
                    item.variants.map((variant) => {
                      if (!variant || !variant.id) return null;
                      return (
                        <Checkbox
                          key={variant.id}
                          label={`${item.title} - ${variant.title}`}
                          checked={temporarySelectedItems.some(
                            (selectedItem) => selectedItem.id === variant.id
                          )}
                          onChange={() => handleItemSelect(variant.id, true, item.id)}
                        />
                      );
                    })
                  ) : (
                    <Checkbox
                      key={item.id}
                      label={item.title}
                      checked={temporarySelectedItems.some(
                        (selectedItem) => selectedItem.id === item.id
                      )}
                      onChange={() => handleItemSelect(item.id)}
                    />
                  )}
                </BlockStack>
              );
            })}
          </FormLayout>
        </Modal.Section>
      </Modal>


    </Page>
  );
}

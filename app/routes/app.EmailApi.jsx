import { useState, useEffect } from "react";
import {
  Page,
  Card,
  TextField,
  Button,
  Text,
  BlockStack,
  InlineGrid,
  Box,
  Toast
} from "@shopify/polaris";
import {  useFetcher, useSubmit } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

export default function DiscountCode() {
  const submit = useSubmit();
  const { mailchimpmetafileds } = useLoaderData();
  const [mailchimpToggleEnable, setMailchimpToggleEnable] = useState(true);
  const [mailchimpApiKey, setMailchimpApiKey] = useState('');
  const [mailchimpServerPrefix, setMailchimpServerPrefix] = useState('');
  const [mailchimpAudienceId, setMailchimpAudienceId] = useState('');
  const handleEnableToggle = () => setMailchimpToggleEnable(!mailchimpToggleEnable);
  const handleApiKeyChange = (value) => setMailchimpApiKey(value);
  const handleServerPrefixChange = (value) => setMailchimpServerPrefix(value);
  const handleAudienceIdChange = (value) => setMailchimpAudienceId(value);
  const [ToastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (mailchimpmetafileds) {
        const settings = mailchimpmetafileds.mailchimpSettings;
        setMailchimpToggleEnable(settings.mailchimpToggleEnable || false); 
        setMailchimpApiKey(settings.mailchimpApiKey || ''); 
        setMailchimpServerPrefix(settings.mailchimpServerPrefix || ''); 
        setMailchimpAudienceId(settings.mailchimpAudienceId || ''); 
    }
}, [mailchimpmetafileds]);


  const handleSave = async () => {
    const settings = {
      mailchimpApiKey,
      mailchimpServerPrefix,
      mailchimpAudienceId,
      mailchimpToggleEnable,
    }
    const settingsType = "email";
    
    submit({ settingsType, settings: JSON.stringify(settings) }, { method: "post" });
    setToastMessage("Setting saved");
  };
  
  return (
    <Page primaryAction={{ content: "Save", onAction: handleSave }}>
      <BlockStack gap="400">
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Mailchimp</Text>
              <Text as="p" variant="bodyMd">Enable or disable Mailchimp integration for your app.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns={{ xs: "1fr auto" }} gap="400" align="center" blockAlign="center">
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd" >
                    {mailchimpToggleEnable ? "Connected to Mailchimp" : "Disconnected"}
                  </Text>
                </BlockStack>
                <Button onClick={handleEnableToggle}>
                  {mailchimpToggleEnable ? "Turn off" : "Turn on"}
                </Button>
                <Text as="p" variant="bodyMd">
                  {mailchimpToggleEnable
                    ? "You are connected to Mailchimp."
                    : "You are not connected to Mailchimp."}
                </Text>
              </InlineGrid>
            </BlockStack>
          </Card>
        </InlineGrid>

        {/* Các trường nhập cho Mailchimp */}
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">API Key</Text>
              <Text as="p" variant="bodyMd">Enter your Mailchimp API key.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="API Key"
                type="text"
                value={mailchimpApiKey}
                onChange={handleApiKeyChange}
                disabled={!mailchimpToggleEnable}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Server Prefix</Text>
              <Text as="p" variant="bodyMd">Enter your Mailchimp server prefix.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="Server Prefix"
                type="text"
                value={mailchimpServerPrefix}
                onChange={handleServerPrefixChange}
                disabled={!mailchimpToggleEnable}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Audience ID</Text>
              <Text as="p" variant="bodyMd">Enter your Mailchimp Audience ID.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="Audience ID"
                type="text"
                value={mailchimpAudienceId}
                onChange={handleAudienceIdChange}
                disabled={!mailchimpToggleEnable}
              />
            </BlockStack>
          </Card>
        </InlineGrid>
        {ToastMessage && <Toast content={ToastMessage} onDismiss={() => setToastMessage("")} />}
      </BlockStack>
    </Page>
  );
}

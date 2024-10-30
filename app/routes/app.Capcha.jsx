import { useState, useEffect } from "react";
import {
  Page,
  Card,
  Select,
  TextField,
  Text,
  BlockStack,
  InlineGrid,
  Box,
  Button,
  Toast
} from "@shopify/polaris";
import {  useFetcher, useSubmit } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
export default function Capcha() {
  const submit = useSubmit();
  const {capchametafields } = useLoaderData();
  const [toggleEnable, setToggleEnable] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState('v2');
  const [siteKey, setSiteKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [ToastMessage, setToastMessage] = useState("");

  const handleEnableToggle = () => setToggleEnable(!toggleEnable);
  const handleVersionChange = (value) => setSelectedVersion(value);
  const handleSiteKeyChange = (value) => setSiteKey(value);
  const handleSecretKeyChange = (value) => setSecretKey(value);

  useEffect(() => {
    if (capchametafields) {
        const settings = capchametafields.capchaSettings;
        setToggleEnable(settings.capchaToggleEnable  || false); 
        setSelectedVersion(settings.version  || 'v2'); 
        setSiteKey(settings.capchaSiteKey || ''); 
        setSecretKey(settings.capchaSecretKey || '');
    }
  }, [capchametafields]);

  const handleSave = async () => {
    const settings = {
      capchaToggleEnable: toggleEnable,
      version: selectedVersion,
      capchaSiteKey: siteKey,
      capchaSecretKey: secretKey
    };

    const settingsType = "capcha";

    submit( {settingsType, settings: JSON.stringify(settings)}, { method: 'post' });
    setToastMessage("Setting saved");
  };

  return (
    <Page primaryAction={{ content: "Save", onAction: handleSave }}>
      <BlockStack gap="400">
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Enable reCAPTCHA</Text>
              <Text as="p" variant="bodyMd">Toggle to enable or disable Google reCAPTCHA integration.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns={{ xs: "1fr auto" }} gap="400" align="center" blockAlign="center">
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    {toggleEnable ? "reCapcha is enabled" : "reCapcha is disabled"}
                  </Text>
                </BlockStack>
                <Button onClick={handleEnableToggle}>
                  {toggleEnable ? "Turn off" : "Turn on"}
                </Button>
                <Text as="p" variant="bodyMd">
                  {toggleEnable
                    ? "reCapcha is enabled for your app."
                    : "reCapcha is disabled for your app."}
                </Text>

              </InlineGrid>
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">reCAPTCHA Version</Text>
              <Text as="p" variant="bodyMd">Select the version of Google reCAPTCHA you want to use.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Select
                label="Version"
                options={[
                  { label: 'reCAPTCHA v2', value: 'v2' },
                  { label: 'reCAPTCHA v3', value: 'v3' },
                ]}
                value={selectedVersion}
                onChange={handleVersionChange}
                disabled={!toggleEnable}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Site Key</Text>
              <Text as="p" variant="bodyMd">Enter your Google reCAPTCHA Site Key.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="Site Key"
                type="text"
                value={siteKey}
                onChange={handleSiteKeyChange}
                disabled={!toggleEnable}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Secret Key</Text>
              <Text as="p" variant="bodyMd">Enter your Google reCAPTCHA Secret Key.</Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField
                label="Secret Key"
                type="text"
                value={secretKey}
                onChange={handleSecretKeyChange}
                disabled={!toggleEnable}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box as="section" paddingInlineStart={{ xs: 400, sm: 0 }} paddingInlineEnd={{ xs: 400, sm: 0 }}>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Guide</Text>
            </BlockStack>
          </Box>
          <Box>
            <BlockStack gap="400">
              <Text as="p" variant="bodyMd">
                Get Google reCAPTCHA V2 Site and Secret key:
                <br />1. Visit the page to sign up for an API key pair with your Gmail account.
                <br />2. Choose reCAPTCHA v2 checkbox.
                <br />3. Fill in authorized domains.
                <br />4. Accept terms of service and click the Register button.
                <br />5. Copy and paste the site and secret key into the above fields.
              </Text>
            </BlockStack>

          </Box>
        </InlineGrid>
        {ToastMessage && <Toast content={ToastMessage} onDismiss={() => setToastMessage("")} />}
      </BlockStack>
    </Page>
  );
}

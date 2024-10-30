import { useState, useEffect } from "react";
import {
  Page,
  Card,
  TextField,
  Select,
  Checkbox,
  Button,
  Text,
  BlockStack,
  InlineGrid,
  Box,
  Divider,
  Toast
} from "@shopify/polaris";
import {  useFetcher, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server.js";
import { json } from "@remix-run/node";
import { GeneralMetafield } from "../backend/actionWithShopifyApi";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const {admin} = await authenticate.admin(request);

  return json({ admin });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const settings = JSON.parse(formData.get("settings"));

  try {
    const { admin } = await authenticate.admin(request);
    const metafieldResponse = await GeneralMetafield(admin, settings);

    if (metafieldResponse.error) {
      return json({ error: metafieldResponse.error }, { status: metafieldResponse.status || 500 });
    }

    return json({ success: true, metafields: metafieldResponse });

  } catch (error) {
    console.error("Error saving general settings:", error);
    return json({ error: "Unable to save settings" }, { status: 500 });
  }
};
export default function GeneralSettings() {
  const fetcher = useFetcher();
  const submit = useSubmit();
  const { generalmetafields} = useLoaderData();
  const [popupTrigger, setPopupTrigger] = useState('After initial time');
  const [initialTime, setInitialTime] = useState('3');
  const [visitorCloseOption, setVisitorCloseOption] = useState('Minimize to topbar');
  const [noThanksReminder, setNoThanksReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('1');
  const [reminderUnit, setReminderUnit] = useState('Hour');
  const [subscribeReminder, setSubscribeReminder] = useState('365');
  const [emailDomains, setEmailDomains] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ToastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (generalmetafields &&  generalmetafields.generalSettings) {
      const settings = generalmetafields.generalSettings;
      setPopupTrigger(settings.popupTrigger);
      setInitialTime(settings.initialTime);
      setVisitorCloseOption(settings.visitorCloseOption);
      setNoThanksReminder(settings.noThanksReminder);
      setReminderTime(settings.reminderTime);
      setReminderUnit(settings.reminderUnit);
      setSubscribeReminder(settings.subscribeReminder);
      setEmailDomains(settings.emailDomains);
    }
  }, [generalmetafields]);
  
  
  const handleSave = () => {
    const settings = {
      popupTrigger,
      initialTime,
      visitorCloseOption,
      noThanksReminder,
      reminderTime,
      reminderUnit,
      subscribeReminder,
      emailDomains
    };

    const settingsType = "general";

    submit({ settingsType, settings: JSON.stringify(settings) }, { method: "post" });
    setToastMessage("Setting saved");

  };
  

  return (
    <Page
      divider
      primaryAction={{ content: "Save", disabled: false, onAction: handleSave }}
    >
      {successMessage && <Text variant="bodyMd" color="success">{successMessage}</Text>}
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Popup Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Configure how the popup will behave for visitors on your store.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Select
                label="Popup trigger"
                options={[
                  { label: 'After initial time', value: 'After initial time' },
                  { label: 'When users scroll', value: 'When users scroll' },
                  { label: 'When users are about to exit', value: 'When users are about to exit' },
                ]}
                value={popupTrigger}
                onChange={setPopupTrigger}
              />
              <TextField
                label="Initial time (seconds)"
                value={initialTime}
                onChange={setInitialTime}
                type="text"
              />
              <Select
                label="Visitor close coupon box option"
                options={[
                  { label: 'Minimize to topbar', value: 'Minimize to topbar' },
                  { label: 'Minimize to bottombar', value: 'Minimize to bottombar' },
                ]}
                value={visitorCloseOption}
                onChange={setVisitorCloseOption}
              />
              <Checkbox
                label='Never remind if "No thanks" button clicked'
                checked={noThanksReminder}
                onChange={() => setNoThanksReminder(!noThanksReminder)}
              />
            </BlockStack>
          </Card>
        </InlineGrid>

        <Divider />
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Reminder Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Control how often the reminders will be shown to the user if they haven’t subscribed.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns="3fr 1fr" gap="200">
                <TextField
                  label="Reminder time if not subscribed"
                  value={reminderTime}
                  onChange={setReminderTime}
                  type="number"
                />
                <Select
                  label="Time unit"
                  options={[
                    { label: 'Hour', value: 'Hour' },
                    { label: 'Day', value: 'Day' },
                  ]}
                  value={reminderUnit}
                  onChange={setReminderUnit}
                />
              </InlineGrid>

              <TextField
                label="Reminder after subscribing"
                value={subscribeReminder}
                onChange={setSubscribeReminder}
                type="number"
                suffix="days"
              />
              <TextField
                label="Restrict email domains (E.g: yahoo.com)"
                value={emailDomains}
                onChange={setEmailDomains}
                type="text"
                placeholder="separate by ','"
              />
            </BlockStack>
          </Card>
        </InlineGrid>
        {ToastMessage && <Toast content={ToastMessage} onDismiss={() => setToastMessage("")} />}
      </BlockStack>
    </Page>
  );
}

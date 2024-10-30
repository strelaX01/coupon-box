import React, { useState } from "react";
import {
  AppProvider,
  Frame,
  Page,
  LegacyTabs,
} from "@shopify/polaris";
import GeneralSettings from './app.GeneralSettings';
import DiscountCode from "./app.DiscountCode";
import EmailApi from "./app.EmailApi";
import Capcha from "./app.Capcha";
import { authenticate } from "../shopify.server.js";
import { json } from "@remix-run/node";
import {
  fetchProductList,
  fetchCollectionList,
  GeneralMetafield,
  getGeneralMetafield,
  DiscountMetafield,
  getDiscountMetafield,
  CreateMailchimpMetafield,
  getMailchimpMetafield,
  CreateCapChaMetafield,
  getCapChaMetafield
} from "../backend/actionWithShopifyApi";

import { 
  saveGeneralSetting, 
  saveEmailSettings,
  saveDiscountCodeSetting,
  saveCapChaSetting,
} from "../backend/coupon-box.js";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const products = await fetchProductList(admin);
  const collections = await fetchCollectionList(admin);
  const generalmetafields = await getGeneralMetafield(admin);
  const discountmetafields = await getDiscountMetafield(admin);
  const mailchimpmetafileds = await getMailchimpMetafield(admin);
  const capchametafields = await getCapChaMetafield(admin);

  return json({
    products,
    collections,
    generalmetafields,
    discountmetafields,
    mailchimpmetafileds,
    capchametafields
  });
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const settingsType = formData.get("settingsType");
  const settings = JSON.parse(formData.get("settings"));

  try {
    const { admin } = await authenticate.admin(request);
    const shopId = await getShopId(admin);

    if (settingsType === "general") {
      const generalSettingResponse = await saveGeneralSetting(shopId, settings);
      const metafieldResponse = await GeneralMetafield(admin, settings);

      if (generalSettingResponse.error) {
        return json({ error: generalSettingResponse.error }, { status: generalSettingResponse.status || 500 });
      }

      if (metafieldResponse.error) {
        return json({ error: metafieldResponse.error }, { status: metafieldResponse.status || 500 });
      }

      return json({ success: true, generalSettings: generalSettingResponse, metafield: metafieldResponse });

    } else if (settingsType === "email") {
      const emailSettingResponse = await saveEmailSettings(shopId, settings);
      const metafieldResponse = await   CreateMailchimpMetafield(admin, settings);

      if (emailSettingResponse.error) {
        return json({ error: emailSettingResponse.error }, { status: emailSettingResponse.status || 500 });
    }

    if (metafieldResponse.error) {
      return json({ error: metafieldResponse.error }, { status: metafieldResponse.status || 500 });
    }
    
      return json({ success: true, emailSettings: emailSettingResponse });
    }

    else if(settingsType === "discount_code") {
      const discountCodeSettingResponse = await saveDiscountCodeSetting(shopId, settings);
      const metafieldResponse = await DiscountMetafield(admin, settings);

      if (discountCodeSettingResponse.error) {
        return json({ error: discountCodeSettingResponse.error }, { status: discountCodeSettingResponse.status || 500 });
      }

      if (metafieldResponse.error) {
        return json({ error: metafieldResponse.error }, { status: metafieldResponse.status || 500 });
      }

    }

    else if(settingsType === "capcha") {
      const capchaSettingResponse = await saveCapChaSetting(shopId, settings);
      const metafieldResponse = await CreateCapChaMetafield(admin, settings);

      if (capchaSettingResponse.error) {
        return json({ error: capchaSettingResponse.error }, { status: capchaSettingResponse.status || 500 });
      }

      if (metafieldResponse.error) {
        return json({ error: metafieldResponse.error }, { status: metafieldResponse.status || 500 });
      }
    }

    return json({ message: "Invalid settings type" }, { status: 400 });

  } catch (error) {
    console.error("Error saving settings:", error);
    return json({ error: "Unable to save settings" }, { status: 500 });
  }
};



export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { id: 'general', content: 'General', panelID: 'general-settings' },
    { id: 'discount code', content: 'Discount code', panelID: 'discount-code-settings' },
    { id: 'email-api', content: 'Email API', panelID: 'email-api-settings' },
    { id: 'capcha', content: 'Google reCAPTCHA', panelID: 'google-recaptcha-settings' },
  ];

  const handleTabChange = (selectedTabIndex) => setSelectedTab(selectedTabIndex);

  return (
    <AppProvider>
      <Page title="Settings">
        <Frame>
          <LegacyTabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
            {selectedTab === 0 && <GeneralSettings />}
            {selectedTab === 1 && <DiscountCode />}
            {selectedTab === 2 && <EmailApi />}
            {selectedTab === 3 && <Capcha />}
          </LegacyTabs>
        </Frame>
      </Page>
    </AppProvider>
  );
}

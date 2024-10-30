import prisma from "../db.server";
import { getShopId } from "./actionWithShopifyApi";
export const saveGeneralSetting = async (shop_id, settings) => {
    const {
        popupTrigger,
        initialTime,
        visitorCloseOption,
        noThanksReminder,
        reminderTime,
        reminderUnit,
        subscribeReminder,
        emailDomains,
    } = settings;

    try {
    
        const existingSetting = await prisma.general_setting.findUnique({
            where: { shop_id },
        });

        let generalSetting;

        if (existingSetting) {

            generalSetting = await prisma.general_setting.update({
                where: { shop_id },
                data: {
                    popup_trigger: popupTrigger,
                    initial_time: initialTime,
                    visitor_close_option: visitorCloseOption,
                    no_thanks_reminder: noThanksReminder,
                    reminder_time: reminderTime,
                    reminder_unit: reminderUnit,
                    subscribe_reminder: subscribeReminder,
                    email_domains: emailDomains,
                },
            });
        } else {
    
            generalSetting = await prisma.general_setting.create({
                data: {
                    shop_id,
                    popup_trigger: popupTrigger,
                    initial_time: initialTime,
                    visitor_close_option: visitorCloseOption,
                    no_thanks_reminder: noThanksReminder,
                    reminder_time: reminderTime,
                    reminder_unit: reminderUnit,
                    subscribe_reminder: subscribeReminder,
                    email_domains: emailDomains,
                },
            });
        }

        return { success: true, generalSetting };
    } catch (error) {
        console.error("Error saving general settings:", error);
        return { error: "Unable to save settings" };
    } finally {
        await prisma.$disconnect(); 
    }
};


export const saveEmailSettings = async (shop_id, settings) => {
    const {
        mailchimpApiKey,
        mailchimpServerPrefix,
        mailchimpAudienceId,
        mailchimpToggleEnable
    } = settings;

    try {
        const existingSetting = await prisma.mailchimp_setting.findUnique({
            where: { shop_id },
        });

        let mailchimpSetting;

        if (existingSetting) {
            mailchimpSetting = await prisma.mailchimp_setting.update({
                where: { shop_id },
                data: {
                    mailchimp_api_key: mailchimpApiKey,
                    mailchimp_server_prefix: mailchimpServerPrefix,
                    mailchimp_audience_id: mailchimpAudienceId,
                    is_eneble: mailchimpToggleEnable
                },
            });
        } else {
            mailchimpSetting = await prisma.mailchimp_setting.create({
                data: {
                    shop_id,
                    mailchimp_api_key: mailchimpApiKey,
                    mailchimp_server_prefix: mailchimpServerPrefix,
                    mailchimp_audience_id: mailchimpAudienceId,
                    is_eneble: mailchimpToggleEnable
                },
            });
        }

        return { success: true, mailchimpSetting };

    } catch (error) {
        console.error("Error saving email settings:", error);
        return { error: "Unable to save email settings" };
    } finally {
        await prisma.$disconnect();
    }
};


export const saveDiscountCodeSetting = async (shop_id, settings) => {
    const {
        discount_type,
        discount_amount,
        active_date,
        selectedAppliesTo,
        selectedItems,
    } = settings;

    try {
        if (!Array.isArray(selectedItems)) {
            console.error("selectedItems is not an array:", selectedItems);
            return { error: "Invalid selected items" };
        }

        const existingSetting = await prisma.discount_setting.findUnique({
            where: { shop_id },
        });

        let discountCodeSetting;

        const item_ids = selectedItems.length ? selectedItems.map(item => item.id).join(", ") : null; 
        const item_titles = selectedItems.length ? selectedItems.map(item => item.title).join(", ") : null; 
        const item_product_title = selectedItems.length ? selectedItems.map(item => item.productTitle).join(", ") : null;
        const item_images = selectedItems.length
            ? selectedItems.map(item => (Array.isArray(item.image) && item.image.length > 0 ? item.image[0].src : null)).join(", ")
            : null;
        const item_type = selectedItems.length ? selectedItems.map(item => item.type).join(", ") : null; 


        const discountAmountStr = parseInt(discount_amount).toString();

        if (existingSetting) {
            discountCodeSetting = await prisma.discount_setting.update({
                where: { shop_id },
                data: {
                    discount_type,
                    discount_amount: discountAmountStr,
                    active_date,
                    selected_applies_to: selectedAppliesTo,
                    item_ids,
                    item_product_title: item_product_title,
                    item_title: item_titles,
                    item_image: item_images,
                    item_type,
                },
            });
        } else {
            discountCodeSetting = await prisma.discount_setting.create({
                data: {
                    shop_id,
                    discount_type,
                    discount_amount: discountAmountStr, 
                    active_date,
                    selected_applies_to: selectedAppliesTo,
                    item_ids,
                    item_product_title: item_product_title,
                    item_title: item_titles,
                    item_image: item_images,
                    item_type,
                },
            });
        }

        return { success: true, discountCodeSetting };

    } catch (error) {
        console.error("Error saving discount code settings:", error);
        return { error: "Unable to save discount code settings" };
    } finally {
        await prisma.$disconnect();
    }
};



export const saveCapChaSetting = async (shop_id, settings) => {
    const {
        version,
        capchaToggleEnable,
        capchaSiteKey,
        capchaSecretKey,
    } = settings;

    try {
        const existingSetting = await prisma.capcha_setting.findUnique({
            where: { shop_id },
        });

        let capchaSetting;

        if (existingSetting) {
            capchaSetting = await prisma.capcha_setting.update({
                where: { shop_id },
                data: {
                    version: version,
                    is_eneble: capchaToggleEnable,
                    site_key: capchaSiteKey,
                    secret_key: capchaSecretKey,
                },
            });
        } else {
            capchaSetting = await prisma.capcha_setting.create({
                data: {
                    shop_id,
                    version: version,
                    is_eneble: capchaToggleEnable,
                    site_key: capchaSiteKey,
                    secret_key: capchaSecretKey,
                },
            });
        }

        return { success: true, capchaSetting };

    } catch (error) {
        console.error("Error saving capcha settings:", error);
        return { error: "Unable to save capcha settings" };
    } finally {
        await prisma.$disconnect();
    }
};


//get capchasetting without shop_idS 
export const getCapChaSetting = async () => {
    try {
        const capchaSetting = await prisma.capcha_setting.findMany();

        if (!capchaSetting) {
            return { error: "No capcha settings found for this shop." };
        }

        return { success: true, capchaSetting };
    } catch (error) {
        console.error("Error fetching capcha settings:", error);
        return { error: "Unable to fetch capcha settings" };
    } finally {
        await prisma.$disconnect();
    }
}


//get getGeneralSetting without shop_idS
export const getGeneralSetting = async () => {
    try {
        const generalSetting = await prisma.general_setting.findMany();

        if (!generalSetting) {
            return { error: "No general settings found for this shop." };
        }

        return { success: true, generalSetting };
    } catch (error) {
        console.error("Error fetching general settings:", error);
        return { error: "Unable to fetch settings" };
    } finally {
        await prisma.$disconnect();
    }
};






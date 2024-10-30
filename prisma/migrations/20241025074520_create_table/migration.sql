-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMPTZ,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "discount_value" TEXT NOT NULL,
    "submit_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agree" BOOLEAN NOT NULL,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capcha_setting" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "site_key" TEXT NOT NULL,
    "secret_key" TEXT NOT NULL,
    "is_eneble" BOOLEAN NOT NULL,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "capcha_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_setting" (
    "id" SERIAL NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_amount" TEXT NOT NULL,
    "active_date" INTEGER NOT NULL,
    "selected_applies_to" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "item_product_title" TEXT,
    "item_title" TEXT,
    "item_ids" TEXT,
    "item_image" TEXT,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "discount_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_setting" (
    "id" SERIAL NOT NULL,
    "popup_trigger" TEXT NOT NULL,
    "initial_time" TEXT NOT NULL,
    "visitor_close_option" TEXT NOT NULL,
    "no_thanks_reminder" BOOLEAN NOT NULL,
    "reminder_time" TEXT NOT NULL,
    "reminder_unit" TEXT NOT NULL,
    "subscribe_reminder" TEXT NOT NULL,
    "email_domains" TEXT NOT NULL,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "general_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mailchimp_setting" (
    "id" SERIAL NOT NULL,
    "mailchimp_api_key" TEXT NOT NULL,
    "mailchimp_server_prefix" TEXT NOT NULL,
    "mailchimp_audience_id" TEXT NOT NULL,
    "is_eneble" BOOLEAN NOT NULL,
    "shop_id" TEXT NOT NULL,

    CONSTRAINT "mailchimp_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "capcha_setting_shop_id_key" ON "capcha_setting"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_setting_shop_id_key" ON "discount_setting"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "general_setting_shop_id_key" ON "general_setting"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "mailchimp_setting_shop_id_key" ON "mailchimp_setting"("shop_id");

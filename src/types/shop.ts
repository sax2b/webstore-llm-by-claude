export interface Shop {
  id: string;
  name: string;
  shop_image?: string;
  storefront_background_image_url?: string;
  storefront?: string;
  supported_languages: string[];
  default_currency?: string;
  default_language?: string;
}

export const MOCK_SHOP: Shop = {
  id: "shop-active-01",
  name: "Pixel Horizon Apparel",
  supported_languages: ["en-US", "th-TH"],
};

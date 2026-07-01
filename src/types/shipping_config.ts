export interface ShippingConfig {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  shipping_provider?: string;
  shipping_fee_type?: string;
  min_fee?: number;
  max_fee?: number;
  currency?: string;
  min_shipping_time?: number;
  max_shipping_time?: number;
}

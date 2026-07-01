export interface PaymentConfig {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  payment_service?: string;
  payment_provider?: string;
  payment_channel?: string;
  pos_only?: boolean;
}

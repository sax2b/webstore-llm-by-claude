import type { Address, CartItem } from './cart';

export interface Order {
  id: string;
  state: string;
  order_number: string;
  created_on: number;
  payment_url?: string;
  payment_authorize_url?: string;
  payment_channel?: string;
  payment_service?: string;
  payment_provider?: string;
  shipping_name?: string;
  billing_address?: Address;
  contents: CartItem[];
  currency: string;
  subtotal: number;
  vat: number;
  total: number;
}

export interface OrderExtra extends Order {
  item_count?: number;
  customer_name?: string;
}

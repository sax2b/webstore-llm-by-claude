export interface Address {
  name?: string;
  telephone?: string;
  email?: string;
  tax_id?: string;
  street?: string;
  street2?: string;
  zipcode?: string;
  sub_city?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface CartItem {
  product_id: string;
  title?: string;
  name?: string;
  item_id?: string;
  price: number;
  currency: string;
  image?: string;
  amount: number;
}

export interface ShoppingCart {
  id: string;
  contents: CartItem[];
  currency: string;
  subtotal: number;
  discount: number;
  nettotal: number;
  vat: number;
  total: number;
  valid: boolean;
  billing_address?: Address;
  shipping_address?: Address;
}

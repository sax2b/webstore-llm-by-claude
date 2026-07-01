import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { GenericResponse, GuestSessionPayload } from '../types/api';
import type { Shop } from '../types/shop';
import type { Product } from '../types/product';
import type { ShoppingCart, Address } from '../types/cart';
import type { ShippingConfig } from '../types/shipping_config';
import type { PaymentConfig } from '../types/payment_config';
import type { Order, OrderExtra } from '../types/order';
import { generateRandomRef } from '../utils/crypto';

const GUEST_BASE_URL =
  import.meta.env.VITE_GUEST_API_ENDPOINT ||
  'https://7wqc9re8q2.execute-api.ap-southeast-1.amazonaws.com/dev';

const CUSTOMER_BASE_URL =
  import.meta.env.VITE_CUSTOMER_API_ENDPOINT ||
  'https://rs5otmrqb5.execute-api.ap-southeast-1.amazonaws.com/dev';

const SHOP_ID = import.meta.env.VITE_SHOP_ID || 'shop-active-01';

export const guestApi = axios.create({
  baseURL: GUEST_BASE_URL,
  timeout: 10000,
});

guestApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const gt = localStorage.getItem('gt');
    if (gt) config.headers.Authorization = `Bearer ${gt}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const customerApi = axios.create({
  baseURL: CUSTOMER_BASE_URL,
  timeout: 10000,
});

customerApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

let activeApiInstance: AxiosInstance = guestApi;

export const getApiInstance = (): AxiosInstance => activeApiInstance;

export const checkSession = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  const gt = localStorage.getItem('gt');

  if (token) {
    activeApiInstance = customerApi;
    return;
  }

  if (gt) {
    activeApiInstance = guestApi;
    return;
  }

  const ref = generateRandomRef();
  const response = await guestApi.post<GenericResponse<GuestSessionPayload>>(
    `/shops/${SHOP_ID}/guests`,
    { ref }
  );
  localStorage.setItem('gt', response.data.results.token);
  activeApiInstance = guestApi;
};

export const fetchShopConfig = async (): Promise<Shop> => {
  const response = await getApiInstance().get<GenericResponse<Shop>>(
    `/shops/${SHOP_ID}`
  );
  return { ...response.data.results, id: SHOP_ID };
};

export const ListProducts = async (): Promise<Product[]> => {
  const lang = localStorage.getItem('lang') ?? 'en-US';
  const res = await guestApi.get<GenericResponse<{ products: Product[]; count: number }>>(
    `/shops/${SHOP_ID}/products?lang=${lang}`
  );
  return res.data.results.products;
};

export const GetProduct = async (productId: string): Promise<Product> => {
  const lang = localStorage.getItem('lang') ?? 'en-US';
  const res = await guestApi.get<GenericResponse<Product>>(
    `/shops/${SHOP_ID}/products/${productId}?lang=${lang}`
  );
  return res.data.results;
};

export const GetCart = async (): Promise<ShoppingCart> => {
  const res = await getApiInstance().get<GenericResponse<{ shopping_cart: ShoppingCart }>>(
    `/shops/${SHOP_ID}/carts/current`
  );
  return res.data.results.shopping_cart;
};

export const UpdateCartContents = async (productId: string, amount: number): Promise<void> => {
  await getApiInstance().post(`/shops/${SHOP_ID}/carts/current/contents`, {
    product_id: productId,
    amount,
  });
};

interface UpdateCartPayload {
  billing_address?: Partial<Address>;
  shipping_address?: Partial<Address>;
  shipping_id?: string;
  payment_id?: string;
  shipping_notes?: string;
}

export const UpdateCart = async (payload: UpdateCartPayload): Promise<void> => {
  await getApiInstance().put(`/shops/${SHOP_ID}/carts/current`, payload);
};

export const ListShippingConfigs = async (): Promise<ShippingConfig[]> => {
  const res = await guestApi.get<GenericResponse<{ shipping_configs: ShippingConfig[]; count: number }>>(
    `/shops/${SHOP_ID}/shippings/configs`
  );
  return res.data.results.shipping_configs;
};

export const ListPaymentConfigs = async (): Promise<PaymentConfig[]> => {
  const res = await guestApi.get<GenericResponse<{ payment_configs: PaymentConfig[]; count: number }>>(
    `/shops/${SHOP_ID}/payments/configs`
  );
  return res.data.results.payment_configs;
};

export const CheckoutOrder = async (): Promise<Order> => {
  const res = await getApiInstance().post<GenericResponse<Order>>(
    `/shops/${SHOP_ID}/carts/current/checkout`
  );
  return res.data.results;
};

export const GetOrder = async (email: string, orderNumber: string): Promise<OrderExtra> => {
  const res = await guestApi.get<GenericResponse<{ order: OrderExtra }>>(
    `/shops/${SHOP_ID}/orders`,
    { params: { e: email, o: orderNumber } }
  );
  return res.data.results.order;
};

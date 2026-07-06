import { ShoppingBag, Package, ShoppingCart, ClipboardList } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  key: string;
  icon: LucideIcon;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'nav.shop',    icon: ShoppingBag,   path: '/' },
  { key: 'nav.product', icon: Package,        path: '/products' },
  { key: 'nav.cart',    icon: ShoppingCart,   path: '/cart' },
  { key: 'nav.order',   icon: ClipboardList,  path: '/order' },
];

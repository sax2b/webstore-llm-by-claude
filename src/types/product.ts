export interface Product {
  id: string;
  title?: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  available: number;
  state?: string;
}

const currencySymbols: Record<string, string> = {
  thb: '฿',
  usd: '$',
  eur: '€',
};

export const formatPrice = (cents: number, currency: string): string => {
  const symbol = currencySymbols[currency.toLowerCase()] ?? currency.toUpperCase() + ' ';
  return `${symbol}${(cents / 100).toFixed(2)}`;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-001",
    title: "Monochrome Tech Hoodie",
    name: "Tech Hoodie",
    price: 489900,
    currency: "thb",
    description: "A clean, minimal heavyweight hoodie crafted from premium French terry cotton. Designed for creators who move between studio sessions and street-level commutes without compromising on form or function.",
    image: "https://placehold.co/400x400/E0E0E0/2C2C2C",
    available: 5,
    state: "active",
  },
  {
    id: "prod-002",
    name: "Structured Cargo Trousers",
    price: 359900,
    currency: "thb",
    description: "Utility-forward tapered trousers with reinforced seam stitching and six-pocket layout. Built for full-day wear with an adjustable waist tab for a dialed-in fit.",
    image: "https://placehold.co/400x400/D5D5D5/2C2C2C",
    available: 2,
    state: "active",
  },
  {
    id: "prod-003",
    title: "Lightweight Shell Jacket",
    name: "Shell Jacket",
    price: 629900,
    currency: "thb",
    description: "Wind-resistant ripstop shell with a packable silhouette and YKK zipper throughout. Designed to layer seamlessly over any base with a clean unbranded exterior.",
    image: "https://placehold.co/400x400/CCCCCC/2C2C2C",
    available: 0,
    state: "active",
  },
  {
    id: "prod-004",
    title: "Merino Knit Crewneck",
    name: "Merino Crewneck",
    price: 549900,
    currency: "thb",
    description: "Extra-fine Merino wool crewneck in a relaxed boxy cut. Temperature-regulating, naturally odor-resistant, and refined enough for both casual and formal contexts.",
    image: "https://placehold.co/400x400/C8C8C8/2C2C2C",
    available: 3,
    state: "inactive",
  },
];

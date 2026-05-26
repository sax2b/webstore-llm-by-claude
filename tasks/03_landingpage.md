# Task 03: E-Commerce Storefront Core Generation

## 🎯 Objective

Generate the layout for the e-commerce landing page and components using React, TypeScript, and standard TailwindCSS.

## 📁 Connected References
- **System Rules**: `SYSTEM.MD` (Strict adherence to global engineering, syntax, and engine protocols is mandatory).
- **Automation Guides**: `AGENTS.md` (Adhere strictly to Global Negative Constraints).
- **Brand Guidelines**: `/branding/BRANDING.MD` (If it does not exist, cancel this task immediately).

> ⚠️ **CRITICAL BRANDING GUARDRAIL**: Every component implemented in this task must strictly adhere to the layout rules, typography tokens, spacing baselines, font families, tracking, and palette variables defined in `/branding/BRANDING.MD`. 
> 
> All code snippets and class names provided in the steps below are **structural architectural examples only**. The agent must adapt all Tailwind utility classes (including but not limited to colors, padding, margins, borders, rounding, and sizing) to match the explicit rules of the Brand Guidelines file. If `/branding/BRANDING.MD` is missing, halt execution and fail immediately.

---

## 🧱 Implementation Requirements & Steps

### 1. BCP-47 Normalized Directory Mapping (`public/locales/`)
- Create the following folders and example translation JSON files:
  - `public/locales/en-US/translation.json`:
  ```json
  {
    "hero.title": "Discover Our Collection",
    "hero.slogan": "Premium minimalist technical wear tailored for modern creators.",
    "cart.button": "Add to Cart",
    "grid.empty": "No products found available.",
    "status.unavailable": "Not Available",
    "status.coming_soon": "Coming Soon"
  }
  ```
  - `public/locales/th-TH/translation.json`:
  ```json
  {
    "hero.title": "เลือกชมสินค้าของเรา",
    "hero.slogan": "เสื้อผ้าเทคนิคอลสไตล์มินิมอลระดับพรีเมียม ออกแบบมาเพื่อครีเอเตอร์ยุคใหม่",
    "cart.button": "เพิ่มลงตะกร้า",
    "grid.empty": "ไม่พบสินค้าในขณะนี้",
    "status.unavailable": "ไม่พร้อมจำหน่าย",
    "status.coming_soon": "เร็วๆ นี้"
  }
  ```
  
### 2. Localization Configuration & Fetcher (`src/i18n/i18n.ts`)
- Write the exact configuration arrays and fetch function:
  ```typescript
  export const SUPPORTED_LOCALES = ['en-US', 'th-TH'];

  export const localeDisplayMap: Record<string, string> = {
    'en-US': 'EN',
    'th-TH': 'TH'
  };

  export const DEFAULT_LOCALE = 'en-US';
  ```
- Create an async function: `fetchTranslations(requestedLocale: string, supportedLocales: string[])`.
- **Fallback Rule**: If `requestedLocale` is not in `supportedLocales`, force the system to use "en-US", set `localStorage.lang = 'en-US'`, and fetch `public/locales/en-US/translation.json`.

### 3. Shop Types & Static Mock Data (`src/types/shop.ts`)
- Create a dedicated schema file to act as the simulated backend structure and configuration for the shop.
- **TypeScript Interface**: Define an interface named `Shop` containing:
  - `id` (string)
  - `name` (string)
  - `shop_image` (optional string, uri format)
  - `storefront_background_image_url` (optional string, uri format)
  - `supported_languages` ([]string)

- **Static Export Object**: Export a constant named `MOCK_SHOP` typed to the Shop interface:
  ```typescript
  export const MOCK_SHOP: Shop = {
    id: "shop-active-01",
    name: "Pixel Horizon Apparel",
    supported_languages: ["en-US", "th-TH"],
  };
  ```

### 4. Shop Context (src/context/ShopContext.tsx)
- Import the Shop interface from `src/types/shop.ts`.
- Create a global React Context (`ShopContext`) and a custom hook helper (`useShop()`) to store, manage, and export the loaded runtime `shopData` state configuration object down the component tree via a structural `<ShopProvider>`.

### 5. Loading Indicator Component (`src/components/LoadingIndicator.tsx`)
- Create a standalone component file for the loading state screen.
- **Dependencies**: Import the `Loader2` icon component from the `lucide-react` library.
- **Layout Styling**: Render a full-viewport, centered flexbox using Tailwind utility classes:
  - Example structural layout: `fixed inset-0 flex items-center justify-center bg-white z-50`.
  - Example spinner layout: `<Loader2 className="animate-spin h-10 w-10 text-blue-500" />`.

### 6. Application Initialization Engine (src/App.tsx)
- Maintain two React states:
  - `currentLocale` (string, loaded from localStorage.lang or defaulting to "en-US")
  - `translations` (the active translation object).
  - `shopConfig` (`Shop` object or null)
- Use a `useEffect` hooked to currentLocale, trigger `fetchTranslations`. Simultaneously simulate an API backend payload fetch by writing `MOCK_SHOP` from `src/types/shop.ts` into the `shopConfig` state.
- **Loading Rule:** If `translations` is null, stop and return `<LoadingIndicator />`. Do not render the main page layout until translations are fully loaded.

### 7. Header/Navigation Bar (`src/components/Header.tsx`)
- Create the top-level navigation row as a standalone component, configuring configuring it as a sticky element:
  - Example Layout Structure: `sticky top-0 z-50 bg-white border-b border-gray-200 w-full px-4 py-3 flex justify-between items-center`.
- Do not mount this globally in `src/App.tsx`. Import and place `<Header />` explicitly at the top of specific page components.
- **UI Layout**
  - **Left Side**:
    - Consume the global `useShop()` context. Render `shopConfig.name` with prominent scaling. On click, redirect the user to `/`.
  - **Right Side**: Group the language select and the shopping cart button together (Example Layout Structure: `flex items-center space-x-4`).
    - **Language Selector**:
      - Render as an extensible dropdown selector with the active languague
      - Loop through `shopConfig.supported_languages`. Use `localeDisplayMap[locale]` to render "EN" or "TH" in the UI.
      - On user click interaction, update `localStorage` under the `lang` key, `currentState` state, and the appllication instantly.
    - **Cart Button**:
      - Create a cart button and notification badge showing the count amount of items.

### 8. Product Types & Static Mock Data (src/types/product.ts)
- Create a single file to handle both interface shapes and initial mock arrays.
- **TypeScript Interface**: Define a strict Product type containing:
  - `id` (string)
  - `title` (optional string)
  - `name` (string)
  - `price` (number in cents)
  - `currency` (string, e.g., 'thb', 'usd')
  - `description` (string)
  - `image` (string)
  - `available` (number, e.g., 0 or 1)
  - `state` (optional string, e.g., 'active' or 'inactive')
- **Static Export Array**: Export a `MOCK_PRODUCTS` array containing at least 4 items to fully test grid layouts and fallback features:
  - Item 1: Standard product (has a title, state: 'active', and available: 5).- Item 2: Dynamic title fallback tester (has NO title, only name, state: 'active', and available: 2).
  - Item 3: Out of stock tester (has title, state: 'active', and available: 0).
  - Item 4: Coming soon tester (has title, state: 'inactive', and available: 3).

### 9. Product Listing Grid (`src/components/ProductGrid.tsx`)
- Create a standalone component to render the responsive product array layout grid.
- **Empty State Rule**: If the product array is empty or length is 0, render a centered placeholder layout message container using the translation state mapping key: `translations['grid.empty']`. Do not render the layout grid frame if empty.
- **Grid Layout Wrapper**: If items exist, render a mobile-first responsive Tailwind grid layout.
  - Example Layout Structure: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4. Enforce a strict 4px baseline spacing layout gap (gap-4 or gap-6)`.
- **Product Card Item Loop**: Loop through the product items inside the grid container:
  - The entire surface area of the card container wrapper must be interactive and clickable to trigger `onProductSelect(product.id)`. No individual buttons may be rendered directly on the card surface.
  - **Data Mapping**:
    - Check `product.title`. If it's missing, undefined, or empty, fallback to render `product.name`.
    - Price is stored in cents. Always devide the interger value by 100 to extract a formatted decimal text string containing the currency symbol format (e.g. USD -> `$10.00`, THB -> `฿10.00`).
    - Append a minor structural description section wrapper displaying a shortened paragraph preview snippet of the product.description string beneath the title layout frame.
  - **Top-Right Corner Badge**:
    - If `product.state === inactive`, render a prominent visual badge containing `translations['status.coming_soon']` backed by a distinct background overlay color.
  - **Image Footer Banner**:
    If `product.available === 0`, render a banner layout spanning accross the bottom baseline boundary of the image containing `translations['status.unavailable']` backed by a distinct background overlay color.

### 10. Core Landing Page Layout Assembly (src/pages/Landing.tsx)
- Create the primary landing page view tree using the components built in the previous steps
- **Header Placement**: Import and mount the <Header /> right at the top of the viewport layout.
- **Hero Banner Area**: Below the navbar, build a full-width banner block. Brand Rule Apply: Background fills, padding blocks, and text alignment rules must match the global page header template styles from the guide.
  - Example Layout Structure: `w-full bg-gray-50 py-12 px-6 mb-6 text-center`
  - Render the localized title using: `translations['hero.title']`.
  - Render the localized slogan string using: `translations['hero.slogan']`.
  - If `shopConfig.storefront_background_image_url` is present, render it dynamically as the background layer behind the hero banner block wrapper.
- **Grid Placement**: Pass `MOCK_PRODUCTS` into the <ProductGrid /> component beneath the hero area.

## 🏁 Task Verification Requirements
- Run local compilation verification scripts via `npm run build` to guarantee zero TypeScript or build errors exist.
- Edit `tasks/manifest.json`, switch the status value for Task 03 from "pending" to "completed", and stop.
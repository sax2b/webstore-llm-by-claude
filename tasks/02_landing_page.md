# Task 02: E-Commerce Storefront Core Generation

## 🎯 Objective

Generate the layout for the e-commerce landing page and components using React, TypeScript, and standard TailwindCSS.

## 📁 Connected References

*   `AGENTS.md`
*   `CODING_STANDARD.md`
*   `INCREMENTAL_CHANGES.md`
*   `/branding/BRANDING.md`
*   `STYLING_UI.md`

> ⚠️ **CRITICAL BRANDING GUARDRAIL**: Every component implemented in this task must strictly adhere to the layout rules, typography tokens, spacing baselines, font families, tracking, and palette variables defined in `/branding/BRANDING.md`. 
> 
> All code snippets and class names provided in the steps below are **structural architectural examples only**. The agent must adapt all Tailwind utility classes (including but not limited to colors, padding, margins, borders, rounding, and sizing) to match the explicit rules of the Brand Guidelines file. If `/branding/BRANDING.md` is missing, halt execution and fail immediately.

---

## 🧱 Implementation Requirements & Steps

### 1. BCP-47 Normalized Directory Mapping (`public/locales/`)
*   Create the following folders and example translation JSON files:
    *   `public/locales/en-US/translation.json`:
        ```json
        {
            "hero.title": "Discover Our Collection",
            "hero.slogan": "Premium minimalist technical wear tailored for modern creators.",
        }
        ```
    *   `public/locales/th-TH/translation.json`:
        ```json
        {
            "hero.title": "เลือกชมสินค้าของเรา",
            "hero.slogan": "เสื้อผ้าเทคนิคอลสไตล์มินิมอลระดับพรีเมียม ออกแบบมาเพื่อครีเอเตอร์ยุคใหม่",
        }
        ```

### 2. Extend Translation Context Keys (`src/i18n`):
*   Add new translation resource dictionary below:

| Translation Key | English Value | Thai Value |
| :--- | :--- | :--- |
| `product.header` | `Products` | `"รายการสินค้า"` |
| `product.add_to_cart_btn` | `"Add to Cart"` | `"เพิ่มสินค้าลงตะกร้า"` |
| `product.unavailable` | `"Not Avaialble"` | `"ไม่พร้อมจำหน่าย"` |
| `product.empty` | `"No products found available"` | `"ไม่พบสินค้าในขณะนี้"` |
| `product.coming_soon` | `"Coming Soon"` | `"เร็วๆ นี้"` |
  
### 3. Localization Configuration & Fetcher (`src/i18n/i18n.ts`)
*   Write the exact configuration arrays and fetch function:
    ```typescript
    export const SUPPORTED_LOCALES = ['en-US', 'th-TH'];

    export const localeDisplayMap: Record<string, string> = {
        'en-US': 'EN',
        'th-TH': 'TH'
    };

    export const DEFAULT_LOCALE = 'en-US';
    ```
*   Create an async function: `fetchTranslations(requestedLocale: string, supportedLocales: string[])`.
*   **Fallback Rule**: If `requestedLocale` is not in `supportedLocales`, force the system to use "en-US", set `localStorage.lang = 'en-US'`, and fetch `public/locales/en-US/translation.json`.

### 4. Shop Types & Static Mock Data (`src/types/shop.ts`)
*   Create a dedicated schema file to act as the simulated backend structure and configuration for the shop.
*   **TypeScript Interface**: Define an interface named `Shop` containing:
    *   `id` (string)
    *   `name` (string)
    *   `shop_image` (optional string, uri format)
    *   `storefront_background_image_url` (optional string, uri format)
    *   `supported_languages` ([]string)

*   **Static Export Object**: Export a constant named `MOCK_SHOP` typed to the Shop interface:
    ```typescript
    export const MOCK_SHOP: Shop = {
        id: "shop-active-01",
        name: "Pixel Horizon Apparel",
        supported_languages: ["en-US", "th-TH"],
    };
    ```

### 5. Shop Context (src/context/ShopContext.tsx)
*   Import the Shop interface from `src/types/shop.ts`.
*   Create a global React Context (`ShopContext`) and a custom hook helper (`useShop()`) to store, manage, and export the loaded runtime `shopData` state configuration object down the component tree via a structural `<ShopProvider>`.

### 6. Application Initialization Engine (src/App.tsx)
*   Maintain three React states:
    *   `currentLocale` (string, loaded from localStorage.lang or defaulting to "en-US")
    *   `translations` (the active translation object).
    *   `shopConfig` (`Shop` object or null)
*   Use a `useEffect` hooked to currentLocale, trigger `fetchTranslations`. Simultaneously simulate an API backend payload fetch by writing `MOCK_SHOP` from `src/types/shop.ts` into the `shopConfig` state.
*   **Loading State**: Render `<LoadingIndicator fullPage/>` until translations and shopConfig are fully loaded including other landings that each page requires.

### 7. Header/Navigation Bar (`src/components/Header.tsx`)
*   Create the top-level navigation row as a standalone component, configuring configuring it as a sticky element:
    *   Example Layout Structure: `sticky top-0 z-50 bg-white border-b border-gray-200 w-full px-4 py-3 flex justify-between items-center`.
*   Do not mount this globally in `src/App.tsx`. Import and place `<Header />` explicitly at the top of specific page components.
*   **UI Layout**
    *   **Left Side**:
        *   Consume the global `useShop()` context. Render `shopConfig.name` with prominent scaling. On click, redirect the user to `/`.
    *   **Right Side**: Group the language select and the shopping cart button together (Example Layout Structure: `flex items-center space-x-4`).
        *   **Language Selector**:
            *   Render as an extensible dropdown selector with the active languague
            *   Loop through `shopConfig.supported_languages`. Use `localeDisplayMap[locale]` to render "EN" or "TH" in the UI. DON'T add any language from `shopConfig.supported_languages` that does not exist in `localDisplayMap`. 
            *   On user click interaction, update `localStorage` under the `lang` key, `currentState` state, and the appllication instantly.
        *   **Cart Button**:
            *   Create a cart button and notification badge showing the count amount of items.

### 8. Product Types & Static Mock Data (src/types/product.ts)
*   Create a single file to handle both interface shapes and initial mock arrays.
*   **TypeScript Interface**: Define a strict Product type containing:
    *   `id` (string)
    *   `title` (optional string)
    *   `name` (string)
    *   `price` (number in cents)
    *   `currency` (string, e.g., 'thb', 'usd')
    *   `description` (string)
    *   `image` (string)
    *   `available` (number, e.g., 0 or 1)
    *   `state` (optional string, e.g., 'active' or 'inactive')
*   **Static Export Array**: Export a `MOCK_PRODUCTS` array containing at least 4 items to fully test grid layouts and fallback features:
    *   Item 1: Standard product (has a title, state: 'active', and available: 5).
    *   Item 2: Dynamic title fallback tester (has NO title, only name, state: 'active', and available: 2).
    *   Item 3: Out of stock tester (has title, state: 'active', and available: 0).
    *   Item 4: Coming soon tester (has title, state: 'inactive', and available: 3).

### 9. Item Page (`src/pages/Item.tsx`)
*   **Router Path**: `/item?id=<product_id>`
*   **Loading State**:
    *   Render `<LoadingIndicator fullPage/>` component (`src/components/LoadingIndicator.tsx`) while loading mocking product data.
    *   Leave a component event handler skeleton to fetch product detail. Full integration will be handled in a later task.
    *   If value of `id` query parameter is empty or fetching data is failed, redirect to `/`.
*   **Layout**:
    *   **Go Back Button**: Render a floating Go-Back button with only symbol to redirect to the previous page located on the top-left corner in any viewports. **IF** a user directly accesses this page in the first time, redirect to `/`.
    *   **Desktop viewport**:
        *   Component must be splited into two distinct horizontal sides. The left side handles product image. The right side vertically stacks a fixed header zone (product name, price, available amount), a scrollable middle zone for the description, a fixed zone for quantity selector, and add-to-cart button.
    *   **Mobile viewport**:
        *   From desktop viewport, pivot all components into a single column, stacking elements from top to bottom.
        *   Every components related product are fixed, except description section can be scrolled.
        *   Move quantity selector and add-to-cart button to persistent footer.
*   **add-to-cart Button**:
    *   If `state` is `inactive` or `available` is equal to 0, immediately disable this action button.
    *   Leave an add-to-cart button component event handler skeletor. Full integration will be handled in a later task.
        

### 10. Product Listing Grid (`src/components/ProductGrid.tsx`)
*   Create a standalone component to render the responsive product array layout grid.
*   **Empty State Rule**: If the product array is empty or length is 0, render a centered placeholder layout message container using the translation state mapping key: `translations['product.empty']`. Do not render the layout grid frame if empty.
*   **Grid Layout Wrapper**: If items exist, render a mobile-first responsive Tailwind grid layout.
    *   Example Layout Structure: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4. Enforce a strict 4px baseline spacing layout gap (gap-4 or gap-6)`.
*   **Product Card Item Loop**: Loop through the product items inside the grid container:
    *   The entire surface area of the card container wrapper must be interactive and clickable to trigger `onProductSelect(product.id)`. No individual buttons may be rendered directly on the card surface.
    *   **Data Mapping**:
        *    Check `product.title`. If it's missing, undefined, or empty, fallback to render `product.name`.
        *   Price is stored in cents. Always divide the integer value by 100 to extract a formatted decimal text string containing the currency symbol format (e.g. USD -> `$10.00`, THB -> `฿10.00`).
        *   Append a minor structural description section wrapper displaying a shortened paragraph preview snippet of the product.description string beneath the title layout frame.
    *   **Top-Right Corner Badge**:
        *   If `product.state === inactive`, render a prominent visual badge containing `translations['product.coming_soon']` backed by a distinct background overlay color.
    *   **Image Footer Banner**: If `product.available === 0`, render a banner layout spanning accross the bottom baseline boundary of the image containing `translations['product.unavailable']` backed by a distinct background overlay color.
    *   No buttons on the product card. The card is clickable.
    *   On user click interaction, redirect to `/item?id=<product_id>`.

### 11. Core Landing Page Layout Assembly (src/pages/Landing.tsx)
*   Create the primary landing page view tree using the components built in the previous steps
*   **Header Placement**: Import and mount the `<Header />` right at the top of the viewport layout.
*   **Hero Banner Area**: Below the navbar, build a full-bleed hero banner block occupying the full viewport height (or near-full, e.g. `min-h-screen`).
    *   **Background**: If `shopConfig.storefront_background_image_url` is present, render it as a full-cover background layer (`bg-cover bg-center`) behind the entire hero block. Apply a dark gradient overlay (transparent → semi-transparent black toward the bottom) on top of the image to preserve text legibility.
    *   **Content Positioning**: All hero content must be horizontally centered at every viewport width — mobile and desktop share the same centering behavior, no left/right alignment shifts on resize.
    *   **Brand Block**: Positioned in the upper-to-middle portion of the hero, stacked vertically and centered:
        *   Localized title using `translations['hero.title']` as the large, primary focal text of the hero — centered horizontally, positioned below the brand block with generous spacing. Font size should scale responsively (larger on desktop, smaller on mobile).
        *   Localized slogan/brand name using `translations['hero.slogan']`
        *   **Scroll-to-Products Control**: Render a small clickable chevron-down icon button, absolutely positioned at the bottom-center of the hero block white/light color, with a subtle bounce or fade animation. On click, smooth-scroll the viewport down to the Products placement.
        *   **Example Layout Structure**: `relative w-full min-h-screen flex flex-col items-center justify-center text-center text-white` for the content wrapper, with the background image/overlay as absolutely-positioned layers behind it (`absolute inset-0 bg-cover bg-center` + `absolute inset-0 bg-gradient-to-b from-transparent to-black/60`).
*   **Products Placement**:
    *   **Header**: Render a bold text element displaying the localized message string from `translations['product.header']`.
    *   **Product Grid Placement**: Pass `MOCK_PRODUCTS` into the <ProductGrid /> component beneath the product header.

## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
*   **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
*   **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
*   **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
*   **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
*   **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
*   **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
*   **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
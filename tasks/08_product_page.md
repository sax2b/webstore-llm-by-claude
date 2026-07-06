# Task 08: Product Page Generation

## 🎯 Objective

Generate the layout for the product page and related components.

## 📁 Connected References

- `AGENTS.md`
- `CODING_STANDARD.md`
- `INCREMENTAL_CHANGES.md`
- `STYLING_UI.md`
- `/branding/BRANDING.md`
- `/docs/openapi/guest/openapi.yaml`

---

## 🧱 Implementation Requirements & Steps

### 1. Extend Translation Context Keys (`src/i18n`):
*   Add new translation resource dictionary below:

| Translation Key | English Value | Thai Value |
| :--- | :--- | :--- |
| `product.header` | `Products` | `"รายการสินค้า"` |
| `nav.product`| `"Products"` | `"รายการสินค้า"` |

### 2. Product Page Assembly (`src/pages/Products.ts`)
*   **Router Path**: `/products`
*   **Loading State**: Render `<LoadingIndicator fullPath/>` while fetching products using `ListProducts()` (`src/api/api.ts`).
*   **Layout**:
    *   **Header**: Render a text element displaying the localized message string from `translations['product.header']`.
    *   **Grid Placement**: Render `<ProductGrid>` component and integrate it with fetched products.

### 3. Shared Navigation Config (`src/components/NavConfig.ts`)
*   Define and export a single ordered array of nav items, used as the source of truth for both Section 4 and Section 5. Do not duplicate this list elsewhere.

| Index | Translation Key | Icon | Route |
| :--- | :--- | :--- | :--- |
| 1 | `nav.shop` | Home icon | `/` |
| 2 | `nav.product` | Product icon | `/products` |
| 3 | `nav.cart` | Cart icon | `/cart` |
| 4 | `nav.order` | Order icon | `/order` |

### 4. Mobile Bottom Navigation (`src/components/BottomNavigation.tsx`)
*   Import the nav item list from `NavConfig.ts`. Do not redefine it inline.
*   Render exactly the 4 items from `NavConfig.ts`, in order, as icon + localized label pairs.
*   Each tab element maps explicitly to the active router paths.
*   **Constraint**: Hidden in the desktop and larger viewports.

### 5. Desktop Navigation (`src/components/Header.tsx`)
*   Import the same nav item list from `NavConfig.ts`, filtered to exclude the `/` route (index 1).
*   Render the remaining items horizontally, centered within the header row.
*   If `Header.tsx` already contains other elements (logo, language selector, etc.), preserve them — insert this nav block without removing or repositioning existing content, using flex layout so the nav sits centered between whatever exists on either side.
*   **Constraint**: Hidden in the mobile and smaller viewports.


## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
*   **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
*   **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
*   **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
*   **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
*   **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
*   **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
*   **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
# Task 04: API Integration on Landing Page

## 🎯 Objective

Implement API integration for fetching the shop products, modifying user cart distributions, and retrieving active cart states. Connect these pipelines directly to the user interface layer, replacing pre-existing component skeletons with API transactions.

## 📁 Connected References

*   `AGENTS.md`
*   `CODING_STANDARD.md`
*   `INCREMENTAL_CHANGES.md`
*   `STYLING_UI.md`
*   `/branding/BRANDING.md`
*   `/docs/openapi/guest/openapi.yaml`

---

## 🧱 Implementation Requirements & Steps

### 1. Schema Types (`src/types`)
*   Read `docs/openapi/guest/openapi.yaml` and `docs/openapi/customer/openapi.yaml`
*   Design schema of shopping cart and cart item (`src/types/cart.ts`)

### 2. Extend API Modules (`src/api/api.ts`)
*   **List Products API**
    *   **Function**: `ListProducts()`
    *   **Usage**: Fetch list of current products under shop ID
    *   **API Endpoints**: `GET /shops/{shop_id}/products?lang=<current_lang>`.
        *   `current_lang` from `localStorage` under the `lang` key.
        *   See API response in `docs/openapi/guest/openapi.yaml`.
    *   **API Instance**: Use `guestApi` instance.
*   **Get Product API**
    *   **Function**: `GetProduct()`
    *   **Usage**: Fetch list of current products under shop ID
    *   **API Endpoints**: `GET /shops/{shop_id}/products/{product_id}?lang=<current_lang>`.
        *   `current_lang` from `localStorage` under the `lang` key.
        *   See API response in `docs/openapi/guest/openapi.yaml`.
    *   **API Instance**: Use `guestApi` instance
*   **Get Cart**
    *   **Function**: `GetCart()`
    *   **Usage**: Get current cart information of user
    *   **API Endpoints**: `GET /shops/{shop_id}/carts/current`.
        *   See API response in `docs/openapi/guest/openapi.yaml` & `docs/openapi/customer/openapi.yaml`.
    *   **API Instance**: Get an active instance from `getApiInstance()`.
*   **Update Cart Contents**
    *   **Function**: `UpdateCartContents()` with product id and its amount as parameters
    *   **Usage**: Update contents on user's cart
    *   **API Endpoints**: `POST /shops/{shop_id}/carts/current/contents`.
        *   See API response in `docs/openapi/guest/openapi.yaml` & `docs/openapi/customer/openapi.yaml`.
    *   **API Instance**: Get an active instance from `getApiInstance()`.

### 3. Synchronize Landing Page Data Layout (`src/pages/LandingPage.tsx`)
*   Render `<LoadingIndicator fullPage/>` component until data is fully loaded.
*   Fetch products using `ListProducts()` from `src/api/api.ts`
*   Fetch cart information using `GetCart()` from `src/api/api.ts`
*   Integrate the pre-existing Landing Page layout with products and cart information.

### 4. Synchronize Product Grid Data (`src/components/ProductGrid.tsx`)
*   Modify an event handler when user selects product cart, load product full detail using `GetProduct()` in `src/api/api.ts`.
*   Modify an event handler when user click add-to-cart button, render `<LoadingIndicator />` at the button. Then, use `UpdateCartContents()` to update cart contents. If success, fetch the current cart and re-render notification badge of cart button in the header (`src/components/Header.tsx`)`

## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
*   **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
*   **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
*   **Verify Expected Results**:
    *   On user click interaction, always render `<LoadingIndicator />` on the button while dispatching its API request.
    *   Mounting the landing page triggers a `GET /shops/{shop_id}/products` call.
    *   Clicking the add-to-cart button sends a POST /shops/{shop_id}/carts/current/contents request with the correct product_id and quantity.
    *   Immediately after a successful add-to-cart response, a GET `/shops/{shop_id}/carts/current` request runs automatically to sync data.
*   **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
*   **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
*   **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
*   **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
*   **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
# Task 05: Cart Page Generation

## 🎯 Objective

Generate the layout for the cart page and components.

## 📁 Connected References

*   `AGENTS.md`
*   `CODING_STANDARD.md`
*   `INCREMENTAL_CHANGES.md`
*   `STYLING_UI.md`
*   `/branding/BRANDING.md`
*   `/docs/openapi/guest/openapi.yaml`

---

## 🧱 Implementation Requirements & Steps

### 1. Extend Translation Context Keys (`src/i18n`):
*   Add new translation resource dictionary below:

| Translation Key | English Value | Thai Value |
| :--- | :--- | :--- |
| `cart.title` | `"My Cart"` | `"ตะกร้าสินค้าของฉัน"` |
| `cart.price_summary` | `"Summary"` | `"สรุปรายการ"` |
| `cart.subtotal` | `"Subtotal"` | `"ยอดรวม"` |
| `cart.vat` | `"VAT"` | `"ภาษีมูลค่าเพิ่ม"` |
| `cart.total` | `"Total"` | `"ยอดเงินรวมทั้งสิ้น"` |
| `cart.checkout` | `"Checkout"` | `"สั่งสินค้า"` |
| `cart.empty` | `"Your cart is empty"` | `"ไม่มีสินค้าในตะกร้า"` |
| `nav.shop`| `"Shop"` | `"ร้านค้า"` |
| `nav.cart`| `"Cart"` | `"ตะกร้าสินค้า"` |
| `go_back_btn`| `"Back"` | `"ย้อนกลับ"` |

### 2. Cart Item Row (`src/components/CartItemCard.tsx`)
*   Create an interactive card row for card item:
    *   **Layout Structure**: Render a responsive horizontal flex layout block.
    *   **Data Alignment**: Render a product image on the fat left. Stack the title (`item.title` fallback to `item.name`) and formatted currency value (`฿` or `$`) vertically in the center.
    *   Product name is in multiple-line using `brake-words`.
    *   **Trash Action Trigger**: Position a trash button icon in the top right corner. Clicking this triggers `UpdateCartContents()` with product ID and 0 amount.
    *   **Quantity Controller Row**: Position the three inline action controls in the bottom right corner:
        *   `[-] Button`: Decrements item quantity by invoking `UpdateCartContents()` (`src/api/api.ts`) with product ID and current amount - 1.
        *   `[Quantity Counter]`: Renders a text container or styled number input capturing the current local volume state.
        *   `[+]` Button: Increments item quantity by invoking `UpdateCartContents()` (`src/api/api.ts`) with product ID and current amount + 1.
    *   Add padding to the detail container to reserve space and prevent text from overlapping with trash button and quantity controller.

### 3. Cart Page Assembly (`src/pages/Cart.tsx`)
*   **Loading State**: Render `<LoadingIndicator fullPage/>` component from `src/components/LoadingIndicator.tsx` while cart information is fetching by using `GetCart()` (`src/api/api.ts`).
*   **Layout**:
    *   Hide `<Header />` for this page
    *   **Go Back Button**: Render Go-Back button with symbol and a text labeled via `translations['go_back_btn']` to redirect to the previous page located on the top-left corner in any viewports. **IF** a user directly accesses this page in the first time, redirect to `/`.
    *   **Header**: Render a left-aligned text element displaying the localized message string from `translations['cart.title']` in any viewports.
    *   **Stack Cart Item Section**:
        *   **Amount Items > 0**: Map elements sequentially into individual `<CartItemCard />` components using item.product_id as the key.
        *   **Amount Items = 0**: Render a centered layout placeholder message container cleanly displaying the dynamic translation key text mapping: `translations['cart.empty']`. Do not render the main product list block frame or the order checkout baseline layout row.
    *   **Price Summary Panel Layout**: Implement a fixed/sticky container panel at the baseline boundary of the screen. Inside this panel, construct the summary view using the following sequence:
        *   **Header**: At the top of the panel, render a bold text displaying `translations['cart.price_summary'].`
        *   **Breakdown Rows**: Render breakdown rows, ensuring the title label sits on the far left and its corresponding numeric value sits on the far right:
            *   **Subtotal Section**: Render a text displaying `translations['cart.subtotal']` on the far left, and the absolute raw numerical value string from `cart.subtotal` on the far right.
            *   **VAT Section**: Render a text displaying `translations['cart.vat']` on the far left, and the structural tax value string from `cart.vat` on the far right.
            *   **Total Section**: Render a text displaying `translations['cart.total']` on the far left, and the grand total value string from `cart.total` on the far right using an accentuated bold font configuration layout (`font-bold text-lg`).
    *   **Checkout Button**:
        *   Render an action element labeled via `translations['cart.checkout']`.
        *   Leave a component event handler skeleton. Full integration will be handled in a later task.
    *   **Desktop viewport**:
        *   Component must be splited into two distinct horizontal sides. The left side handles stack cart item section. The right side vertically stacks of price summary panel and checkout button.
    *   **Mobile viewport**:
        *   Stack both of stack cart item section and price summary panel, respectively.
        *   Render a persistent full-width checkout button (`w-full`)

### 4. Global Persistent Footer Menu (`src/components/BottomNavigation.tsx`)
*   Implement a bottom navigation bar rendering exactly layout options sequentially. **This component must be completely hidden on desktop and larger viewports**.
*   Each tab element maps explicitly to the active router paths:

| Sequence index | Translation Key Reference | Default Label Graphic Link | Target Path Route |
| :--- | :--- | :--- | :--- |
| 1 | `nav.shop` | Marketplace Home icon | `/` |
| 2 | `nav.cart` | Shopping Cart layout icon | `/cart` |

*   **Highlighter Logic**: Track active window location properties via your router layer (e.g., `useLocation()`) and automatically enforce distinct active color highlighting styles on the node matching the selector path configuration.

## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
*   **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
*   **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
*   **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
*   **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
*   **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
*   **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
*   **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
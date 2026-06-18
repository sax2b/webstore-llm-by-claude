# Task 06: Cart Page Subviews Generation

## 🎯 Objective

Generate the layout for the cart page subviews and components.

## 📁 Connected References

- `AGENTS.md`
- `CODING_STANDARD.md`
- `INCREMENTAL_CHANGES.md`
- `STYLING_UI.md`
- `/branding/BRANDING.md`
- `/docs/openapi/guest/openapi.yaml`
- `/docs/openapi/customer/openapi.yaml`

---

## 🧱 Implementation Requirements & Steps

### 1. Extend Translation Context Keys (`src/i18n`):
- Add new translation resource dictionary below:

| Translation Key | English Value | Thai Value |
| :--- | :--- | :--- | :--- |
| `checkout.title` | `"Checkout"` | `"รายการสั่งซื้อ"` |
| `checkout.delivery_address_title` | `"Delivery Address"` | `"ที่อยู่ผู้จัดส่ง"` |
| `checkout.shipping_config_option` | `"Shipping Option"` | `"ตัวเลือกการจัดส่ง"` |
| `checkout.shipping_note` | `"Note"` | `"ข้อความ"` | Shipping note label |
| `checkout.shipping_note_placeholder` | `"Please leave a message"` | `"ฝากข้อความถึงผู้ขายหรือผู้บริการส่ง"` |
| `checkout.payment_config_option` | `"Payment Method"` | `"ช่องทางการชำระเงิน"` |
| `checkout.place_order_btn` | `"Place Order"` | `"สั่งสินค้า"` |
| `shipping_info.title` | `"Shipping Information"` | `"ที่อยู่จัดส่ง"` |
| `shipping_info.customer_detail` | `"Customer Detail"` | `"ข้อมูลผู้ซื้อ"` |
| `shipping_info.customer_detail.name` | `"Name"` | `"ชื่อ"` |
| `shipping_info.customer_detail.telephone` | `"Telephone"` | `"เบอร์โทรศัพท์"` |
| `shipping_info.customer_detail.email` | `"Email"` | `"อีเมล"` |
| `shipping_info.save_btn` | `"Save"` | `"บันทึก"` |

### 2. Schema Types (`src/types`)
- Read `docs/openapi/guest/openapi.yaml` and `docs/openapi/customer/openapi.yaml`
- Design schema of shipping config (`src/types/shopping_config.ts`) and payment config (`src/types/payment_config.ts`)

### 3. Extend API Modules (`src/api/api.ts`)
*   **List Shipping Configs API**
    - **Function**: `ListShippingConfigs()`
    - **Usage**: Fetch list of shipping configurations under shop ID
    - **API Endpoints**: `GET /shops/{shop_id}/shippings/configs`.
        - See API response in `docs/openapi/guest/openapi.yaml`.
    - **API Instance**: Use `guestApi` instance.
*   **List Payment Configs API**
    - **Function**: `ListPaymentConfigs()`
    - **Usage**: Fetch list of payment configurations under shop ID
    - **API Endpoints**: `GET /shops/{shop_id}/payments/configs`
        - See API response in `docs/openapi/guest/openapi.yaml`.
    - **API Instance**: Use `guestApi` instance.
*   **Update Cart API**
    - **Function**: `UpdateCart()`
    - **Usage**: Update information to user's cart
    - **API Endpoints**: `GET /shops/{shop_id}/payments/configs`
        - See API response in `docs/openapi/guest/openapi.yaml`.
    - **API Instance**: Get an active instance from `getApiInstance()`.

### 4. Checkout View Layout - Sub View of /cart (`src/pages/Cart.tsx`):
- **Go Back Button**: Render Go Back button to go to the previous page or view on the top-left corner.
- **Header**: Render a centered text element displaying the localized message string from `translations['checkout.title']`.
- **Address Section**: Use primary background in `BRANDING.md` to highlight this section
    - **Header**: Render a text element displaying the localized message string from `translations['checkout.delivery_address_title']`.
    - **Information Section**: Implement three consecutive text input fields with labels placed directly above each input. The fields must be:
        - name (Type: text, Label: `translations['shipping_info.customer_detail.name']`).
        - telephone (Type: tel, Label: `translations['shipping_info.customer_detail.telephone']`).
        - email (Type: email, Label: `translations['shipping_info.customer_detail.email']`).
    - On user click interaction, redirect to Edit Shipping Information View.
- **Stack Cart Item Section**: Render stacked cart item using `<CartItemCard/>`.
- **Shipping Configurations Section**:
    - **Header**: Render a text element displaying the localized message string from `translations['checkout.shipping_config_option']`.
    - **Dropdown Option Selector**:
        - Render a dropdown option selector with options from `ListShippingConfigs()` by display `name` with `id` as key.
        - After user selection, don't dispatch any request. The selected value is updated later when clicking Place Order Button.
    - **Note Section**:
        - Render a text displaying `translations['checkout.shipping_config_note']` on the far left, and input element on the far right with `translations['checkout.shipping_config_placeholder']` as its placeholder.
- **Payment Configurations Section**:
    - **Header**: Render a text element displaying the localized message string from `translations['checkout.payment_config_option']`.
    - **Dropdown Option Selector**:
        - Render a dropdown option selector with options from `ListPaymentConfigs()` by displaying `name` with `id` as key.
        - After user selection, don't dispatch any request. The selected value is updated later when clicking Place Order Button.
- **Price Summary Panel Layout**: Implement a fixed/sticky container panel at the baseline boundary of the screen. Inside this panel, construct the summary view using the following sequence:
    - **Header**: At the top of the panel, render a bold text displaying `translations['cart.price_summary'].`
    - **Breakdown Rows**: Render breakdown rows, ensuring the title label sits on the far left and its corresponding numeric value sits on the far right:
        - **Subtotal Section**: Render a text displaying `translations['cart.subtotal']` on the far left, and the absolute raw numerical value string from `cart.subtotal` on the far right.
        - **VAT Section**: Render a text displaying `translations['cart.vat']` on the far left, and the structural tax value string from `cart.vat` on the far right.
        - **Total Section**: Render a text displaying `translations['cart.total']` on the far left, and the grand total value string from `cart.total` on the far right using an accentuated bold font configuration layout (`font-bold text-lg`).
- **Place Order Button**:
    - Render a persistent full-width action element selector (`w-full`) labeled via `translations['checkout.place_order_btn']`.
    - **Conditions**: The button is enabled if all conditions below are matched:
        - Customer details are filled.
        - Amount of items are greater than 0.
        - Both of shipping config and payment config are selected.
    - On user click interaction, execute the following steps:
        - **Loading State**: Render `<LoadingIndicator />` inside button until every requests done.
        - **Update information needed**: Update `id` as `shipping_id` from Shipping Configurations Section and `id` as `payment_id` and `note` as `shipping_notes` from Payment Configurations Section by using `UpdateCart()` (`src/api/api.ts`).
        - **Send Checkout Request**: Leave a component event handler skeleton. Full integration will be handled in a later task.
- **Layout Constraints**:
    - Disappear Persistent Footer Menu in this subview.
    - All fixed/static elements at the baseline boundary MUST not overlap other elements.
    - Every section that has header MUST render its header first and then, render all contents inside the card with minimal gaps between the blocks.

### 5. Edit Shipping Information View Layout - Sub View of /cart (`src/pages/Cart.tsx`)
- **Go Back Button**: Render Go Back button to go to the previous page or view on the top-left corner.
- **Header**: Render a centered text element displaying the localized message string from `translations['shipping_info.title']`.
- **Customer Detail Section**:
    * **Header**: Render a text element displaying the localized message string from `translations['shipping_info.customer_detail']`.
    * **Form Section**: Implement three consecutive text input fields with labels placed directly above each input. The fields must be:
        - name (Type: text, Label: `translations['shipping_info.customer_detail.name']`).
        - telephone (Type: tel, Label: `translations['shipping_info.customer_detail.telephone']`).
        - email (Type: email, Label: `translations['shipping_info.customer_detail.email']`).
- **Save Button**:
    - Render a persistent full-width action element selector (`w-full`) labeled via `translations['shipping_info.save_btn']`.
    - On user submission, update `billing_address` using `UpdateCart()` (`src/api/api.ts`).
- **Layout Constraints**:
    - Disappear Persistent Footer Menu in this subview.
    - All fixed/static elements at the baseline boundary MUST not overlap other elements.

### 6. Checkout Button Event Handler (`src/pages/Cart.tsx`)
-   On user click interaction, execute following below:
    -   **Loading State**: Display `<LoadingIndicator/>` component from `src/components/LoadingIndicator.tsx` while fetching data used by using APIs (`src/api/api.ts`):
        - Fetch list of shipping configurations by using `ListShippingConfigs()`.
        - Fetch list of payment configurations by using `ListPaymentConfigs()`.
    -   **Address Validation**:
        - **IF** address does not exist in cart, render Edit Shipping Information View.
        - Otherwise, render Checkout View.

## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
* **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
* **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
* **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
* **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
* **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
* **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
* **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
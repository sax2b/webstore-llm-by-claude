# Task 07: Order Page Generation

## 🎯 Objective

Generate the layout for the order view, order page and related components.

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
| `order.title.awaiting_payment` | `"Press 'Pay Now' to Make a Payment"` | `"กดปุ่ม 'จ่ายเงิน' เพื่อชำระเงิน"` |
| `order.title.completed` | `"Payment Completed"` | `"ชำระเงินสำเร็จ"` |
| `order.default_title` | `"Your Order is Confirmed"` | `"ยืนยันคำสั่งซื้อของคุณแล้ว"` |
| `order.order_detail.order_number` | `"Order No."` | `"รายการสั่งซื้อ"` |
| `order.order_detail.order_time` | `"Order Time"` | `"เวลาการสั่งซื้อ"` |
| `order.order_detail.payment_method` | `"Payment Method"` | `"วิธีการชำระเงิน"` |
| `order.order_detail.shipping_method` | `"Shipping Method"` | `"วิธีการจัดส่ง"` |
| `order.order_detail.shipping_address` | `"Shipping Address"` | `"ที่อยู่จัดส่ง"` |
| `order.quantity`| `"Quantity"` | `"จำนวน"` |
| `order.return_to_store_btn`| `"Return to Store"` | `"กลับสู่ร้านค้า"`​ |
| `order.pay_now_btn`| `"Pay Now"` | `"จ่ายเงิน"`​ |
| `order.customer_detail` | `"Customer Detail"` | `"ข้อมูลผู้ซื้อ"` |
| `order.customer_detail.name` | `"Name"` | `"ชื่อ"` |
| `order.customer_detail.telephone` | `"Telephone"` | `"เบอร์โทรศัพท์"` |
| `order.customer_detail.email` | `"Email"` | `"อีเมล"` |
| `order.search_title` | `"View Your Order"` | `"ค้นหาคำสั่งซื้อของคุณ"`|
| `order.search_description` | `"Enter the email used at checkout and your Order No. to see order details"` | `"กรุณาป้อนอีเมลที่ใช้ชำระเงินและหมายเลขคำสั่งซื้อของคุณเพื่อดูรายละเอียดคำสั่งซื้อ"`|
| `order.search_input.email` | `"Email"` | `"อีเมล"` |
| `order.search_input.order_number` | `"Order No."` | `"หมายเลขออเดอร์"` |
| `order.search_btn` | `"View Order"` | `"ดูคำสั่งซื้อ"` |
| `nav.order` | `"Order"` | `"ออเดอร์"` |

### 2. Schema Types (`src/types`)
*   Read `docs/openapi/guest/openapi.yaml`
*   Design schema of order (`src/types/order.ts`).

### 3. Extend API Modules (`src/api/api.ts`)
*   **Checkout Order API**
    *   **Function**: `CheckoutOrder()`
    *   **Usage**: Checkout order on a current user's cart
    *   **API Endpoints**: `POST /shops/{shop_id}/carts/current/checkout`.
    *   **API Instance**: Get an active instance from `getApiInstance()`.
*   **Get Order API**
    *   **Function**: `GetOrder()`
    *   **Usage**: Fetch order detail
    *   **API Endpoints**: `GET /shops/{shop_id}/orders`
        *   **Query Parameters**:
            *   `e`: User's email.
            *   `o`: Order number.
    *   **API Instance**: Use `guestApi` instance.

### 4. Order View (`src/pages/Cart.ts`)
*   **Loading state**: Render `<LoadingIndicator fullPage/>` while fetching order data using `GetOrder()` (`src/api/api.ts`).
*   **Layout**:
    *   **Header**: Render a centered text element displaying the localized message string depending on order state:

        | Order State | Translation Key | Condition |
        | :--- | :--- | :--- |
        | `awaiting_payment` | `order.title.awaiting_payment`| `payment_url` must exists in order. If not, display a text with translation key`order.default_title` |
        | `completed` | `order.title.completed`| - |

    *   **Order Detail Section**:
        *   **Order Number**: Render a text labeled via `translations['order.order_detail.order_number']` as a title above big bold `order_number`.
        *   **Order Time**: Render `translations['order.order_detail.order_time']` as a title followed by `created_on` as timestamp.
    *   **Customer Detail Section**:
        * **Header**: Render a text element displaying the localized message string from `translations['order.customer_detail']`.
        * Implement each values starting by labels followed by :. The fields must be:
            *   Label: `translations['order.customer_detail.name']`, Value: `order.billing_address.name.
            *   Label: `translations['order.customer_detail.telephone']`, Value: `order.billing_address.telephone`.
            *   Label: `translations['order.customer_detail.email']`, Value: `order.billing_address.email`.
            *   Label: `translations['order.order_detail.payment_method']`, Value: `order.payment_method`.
            *   Label: `translations['order.order_detail.shipping_method']`, Value: `order.shipping_method`.
    *   **Item Stack Layer**:
        *   Loop throught a item list (`contents`)
        *   **Layout Structure**: Render a responsive horizontal flex layout block.
        *   **Data Alignment**: Render a product image on the far left. Stack the title (`item.title` fallback to `item.name`) in multiple-line using `brake-words` and Both of formatted currency value (`฿` or `$`) and amount of items (Format: `translations[order.quantity)`: <`item.amount`>) horizontally in the center.
    *   **Horizontal Grouping Buttons**:
        *   **Return to Store Button**:
            *   Render a secondary-level button element labeled via `translations['order.return_to_store_btn']`.
            *   On user click interaction, redirect to `/`.
        *   **Pay Now Button**:
            *   Render a primary-level button element labeled via `translations['order.pay_now_btn']` with primary color.
            *   On user click interaction, open a new tab via `payment_url` inside order data.
            *   **Condition**: The button appears as a primary button if `order.state` is `awaiting_payment` and `order.payment_url` exists.
        *   **Default**: Render the component under the detail section.
        *   **Mobile viewport**: Render a persistent full-wide space containing horizontal grouping buttons (`w-full`).
*   **Layout Constraints**:
    *   Disappear Persistent Footer Menu in this subview.
    *   All fixed/static elements at the baseline boundary MUST not overlap other elements.

### 5. Checkout Button Event Handler (`src/pages/Cart.ts`)
*   On Checkout button in Checkout view:
    *   Use `CheckoutOrder()` (`src/api/api.ts`) after cart information is updated.
    *   If success, render Order View using the result of the previous step.

### 6. Complete Page Assembly (`src/pages/Complete.ts`)
*   Router Path: `/complete`
*   **IF** `e` as email and `o` as order number exist,
    *   **Loading state**: Render `<LoadingIndicator fullPage/>` component while fetching order data using `GetOrder()` (`src/api/api.ts`).
    *   Render Order View using previously loaded order data.
*   **IF** order data is assigned, render Order View immediately. Don't need to fetch data again.

### 7. Order Page Assembly (`src/pages/Order.ts`)
*   Router Path: `/order`
*   **Layout**:
    *   **Header Placement**: Import and mount the `<Header />` right at the top of the viewport layout.
    *   **Header Section**: Render both texts labeled via `translations[order.search_title]` and `translations[order.search_description]` vertically in the center.
    *   **Information Section**: Implement three consecutive text input fields with labels placed directly above each input. The fields must be:
        *   email (Type: text, Label: `translations['order.search_input.email']`).
        *   order number (Type: text, Label: `translations['order.search_input.order_number']`).
    *   **View Order Button**:
        *   Render a button element (`w-full`) labeled via `translations['order.search_btn']`.
        *   On user submission, execute following the list below:
            *   **Loading state**: Render `<LoadingIndicator />` on the view order button while fetching order data using `GetOrder()` (`src/api/api.ts`).
            *   If fetching order data is success, assign the data to complete page.

*  Consider query parameters in the path:
    *   If `e` as email and `o` as order number exist, render Order View immediately.
    *   If not, render Order Search View following the layout below:

### 8. Global Persistent Footer Menu (`src/components/BottomNavigation.tsx`)
*   Implement a bottom navigation bar rendering exactly layout options sequentially. **This component must be completely hidden on desktop and larger viewports**.
*   Each tab element maps explicitly to the active router paths:

| Sequence index | Translation Key Reference | Default Label Graphic Link | Target Path Route |
| :--- | :--- | :--- | :--- |
| 1 | `nav.shop` | Marketplace Home icon | `/` |
| 2 | `nav.cart` | Shopping Cart layout icon | `/cart` |
| 3 | `nav.order` | Order layout icon | `/order` |

## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
*   **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
*   **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
*   **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
*   **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
*   **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
*   **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
*   **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
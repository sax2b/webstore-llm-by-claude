I want you to build a NEW React component/application with TypeScript and TailwindCSS based on these brand guidelines and the user's requirements.

<branding-format>
BRAND GUIDELINES

COLOR SYSTEM:
- Color Scheme: light mode
- Primary Color: #1E88E5
- Accent Color: #1E88E5
- Background: #F5F5F5
- Text Primary: #2C2C2C
- Link Color: #C69A5E

TYPOGRAPHY:
- Primary Font: Noto Sans Thai Looped
- Heading Font: Noto Sans Thai Looped
- Font Stack (Body): noto-sans-thai-looped, sans-serif
- Font Stack (Heading): noto-sans-thai-looped, sans-serif
- H1 Size: 14px
- H2 Size: 14px
- Body Size: 18px

SPACING & LAYOUT:
- Base Spacing Unit: 4px
- Border Radius: 12px

BUTTON STYLES:
Primary Buttin:
- Background #1E88E5
- Text Color: #FFFFFF
- Border Radius: 12px
- Shadow: none

Secondary Button:
- Background #C69A5E
- Text Color: #050505
- Border Radius: 12px
- Shadow: none

INPUT FIELDS:
- Border Color: #CCCCCC
- Border Radius: 6px

BRAND PERSONALITY:
- Tone: modern
- Energy: medium
- Target Audience: business users and end consumers

DESIGN SYSTEM:
- Framework: tailwind
- Component Library: custom

ASSETS:
- Logo: Not available
</branding-format>

USER'S REQUEST:
Create e-commerce website for shop Commerce Test using these brand guidelines. The shop has slogan: 'Make life easier'.

## CORE REQUIREMENTS
**Authentication & Session Management**
Execute this validation workflow on initial application loading:
- If `token` exists, inject it into header for Customer APIs.
- If `gt` exists, inject it into header for Guest APIs.
- Otherwise, run guest session creation workflow:
  - Generate randomized 16-character string to serve as `ref` parameter.
  - Dispatch API request: `POST /shops/{shop_id}/guests`
  - Extract returned token from API response, write it to localStorage under `gt` key

**Shop Configuration Management**
Execute this workflow on initial application loading after the Session Management completes (`token` or `gt` is present in localStorage);
- Trigger a Guest API to fetch shop config: `GET /shops/{shop_id}`
- Parse API response containing shop configuration and inject it into shop state to initialize dependent layout components

**Page Loading**
- Render an animated loading indicator with brief action text until page is fully loaded

**Button Loading**
- Render an animated loading indicator without text until the action is completed

## LAYOUT & STRUCTURES
### PRODUCT LISTING GRID
- **UI State & Format**:
  - Render items in a Grid/Card component format.
  - **Breakpoints**:
    - **Mobile viewport**: 1 or 2 columns per row.
    - **Desktop viewport**: 3 or 4 columns per row.
  - The entire cart must be clickable.
  - No buttons should be rendered on the card surface itself.
- **Data mapping**:
  - `image`: Render product image.
  - `name` or `title`: Render product name string.
  - `price`: Map from `price` integer stored in cents. Format dynamically to standard decimal currency (e.g. `1000` cents -> `$10.00`). Include `currency` symbol.
  - `description`: Render a short preview snippet of the product description.
- **Side Effect & Action**:
  - On user click interation, execute the following sequence:
    - Step A: Data Fetching
      - Trigger a Guest API call to ferch product full detail: `GET /shops/{shop_id}/products/{product_id}`
     - Step B: Modal Presentation
      - Open the data inside a large overlay modal.
      - **Layout Constraints**:
        - All visual elements in the modal must remain fixed/static in height.
        - **Exception**: `description` field container must have overflow scrolling enabled across all platforms.
      - Step C: Quantity Selector Row.
        - Render an inline row containing three interactive elements
          - `[-]` Button: Decrements item quantity.
          - `[Quantity Counter]`: Display current local count state. Allow user to update count directly.
          - `[+] Button`: Increments item quantity.
      - Step D: Add-To-Cart Action
        - Render an `[Add to Cart]` button positioned specifically for easy bottom thumb access on mobile viewports.
        - **Side Effect & Action:**
            - On button click, trigger an API call to update cart contents: `POST /shops/{shop_id}/carts/current/contents`.
            - API Endpoint depends on the acive user authorization (Guest or customer/registered user).

### NAVBAR
UI Layout:
- Left-side components:
  - **Shop Name**:
    - **UI State & Format**: Render shop name with prominent scaling.
    - **Side Effect / Action**: On user click interaction, redirect the user router to `/` or home page.
- Rigt-side components:
  - **Language Selector Component**:
    - **Data Source**: Fetch list of options from `supported_languages` in shop config.
    - **UI State & Format**:
      - Render as a dropdown selector.
      - Display the active language as a capitalized 2-letter ISO code (e.g., `TH` for Thai, `EN` for English) including option languages display.
    - **Side Effect / Action**:
      - On user selection, update `lang` key in localStorage with the new value.
      - Trigger application translation context refresh.
      - Apply selected language with specific API calls.

  - **Card Button Component**:
    - **UI State & Format**:
      - Render a clickable button with a notification badge showing the total count of items
    - **Side Effect / Action**:
      - On user clicking, redirect the user router to `/cart` page.
      - **IMPORTANT**: Disable button if cart page do not appear in `WEB PAGES`

### WEB PAGES
**Page 1 - LANDING PAGE**
- **User Stories**:
  - As a user, I see navbar and hero section in first access.
  - As a user, I scroll down to see all products in the shop.
  - As a user, I can see detail of selected product when I select any product card.
- **Data Source**:
  - Dispatch an API request to fetch products with the current language: `GET /shops/{shop_id}/products?lang=<current_lang>`.
- **UI Layout**:
  - **Navbar**: Required. Top-sticky. Embed `NAVBAR` component as specified in the previous prompt.
  - **Hero Section**:
    - Render `name` in shop config inside with prominent scaling
    - Dynamic inject the custom slogan from user's request below the shop name.
    - If `storefront_background_image_url` is present in shop config, set it as the background in the section.
  - **Product Section**:
    - Render a static text title: `Products`.
    - Render PRODUCT LISTING GRID component as specified in the previous prompt.
  - **Strict Layout Limits**: Do not render, generate, or inject buttons, footer, and interactive elements that are not explicitly specified.

**IMPORTANT**: Use these guidelines (colors, fonts, spacing, design, patterns) in the <branding-format> tags above to build what the user requested

CRITICAL REQUIREMENTS:
- DO create a COMPLETELY NEW component that fulfills the user's request
- Build ONLY what the user requested - nothing more
- Make it a minimal, focused implementation of the user's request

STYLING REQUIREMENTS:
- Apply the EXACT colors from the brand palette (primary, accent, background, text colors)
- Use the EXACT typography (font families, font sizes for h1, h2, body)
- Implement button styles EXACTLY as specified (colors, shadows, border radius)
- Style input fields with the exact border color and border radius
- Use Tailwind CSS with inline color values matching the brand palette EXACTLY
- If fonts need to be imported, add @import or @font-face rules to index.css
- Create custom CSS classes in index.css for complex shadows/effects that can't be done with Tailwind

FONT SETUP:
- Add font family Noto Sans Thai Looped to your CSS
- Use font stack: noto-sans-thai-looped, sans-serif
- Set body font size to 16px

COMPONENT STRUCTURE:
- src/index.css - Include brand fonts, custom shadows/effects, and base styling
- src/App.tsx - Should ONLY render the requested component (e.g., just <PricingPage /> if user wants pricing)
- src/components/[RequestedComponent].tsx - The actual component fulfilling the user's request

TECHNICAL REQUIREMENTS:
- Create a WORKING, self-contained application
- DO NOT import components that don't exist .
- Make sure the app renders immediately with visible content
- All colors must match the brand palette EXACTLY
- All spacing must use the 4px base unit
- Buttons must have the exact styling specified in the guidelines

Focus on building something NEW, minimal, and functional that perfectly matches the brand aesthetic and design system.

CRITICAL: You MUST complete EVERY file you start. If you write:

NEVER write partial code like:
<h1>Build and deploy on the AI Cloud.</h1>
<p>Some text...</p>  ❌ WRONG

ALWAYS write complete code:
<h1>Build and deploy on the AI Cloud.</h1>
<p>Some text here with full content</p>  ✅ CORRECT

If you're running out of space, generate FEWER files but make them COMPLETE.
It's better to have 3 complete files than 10 incomplete files.

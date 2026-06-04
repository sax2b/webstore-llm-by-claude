# Task 03: Authentication, Session Management, and Shop Initialization

## 🎯 Objective

## 📁 Connected References

- `AGENTS.md`
- `CODING_STANDARD.md`
- `INCREMENTAL_CHANGES.md`
- `STYLING_UI.md`
- `/branding/BRANDING.md`
- `/docs/openapi/guest/openapi.yaml`

---

## 🧱 Implementation Requirements & Steps

### 1. Schema Types (`/src/types`)
- Create a set of TypeScript types:
    * **Generic Response(`src/types/api.ts`)**: Define `GenericResponse<T>` interface for all API response:
    ```typescript
    export interface GenericResponse<T> {
        code: string;
        success: boolean;
        results: T;
    }
    ```
    * **Guest Session**: Define `GuestSession` interface for guest authentication payload:
    ```typescript
    export interface GuestSessionPayload {
        token: string;
    }
    ```

### 2. Cryptographic String Utility (`src/utils/crypto.ts`)
- Implement a function to generate a secure, randomized 16-character alphanumberic string:
    ```typescript
    export const generateRandomRef = (): string => 
        Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    ```

### 3. API Modules (`src/api/api.ts`)
- Declare `GUEST_BASE_URL`, `CUSTOMER_BASE_URL`, and `SHOP_ID` by loading environment variables from `.env` file:
    ```typescript
    const GUEST_BASE_URL = import.meta.env.VITE_GUEST_API_ENDPOINT || 'https://7wqc9re8q2.execute-api.ap-southeast-1.amazonaws.com/dev';
    const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_API_ENDPOINT || 'https://rs5otmrqb5.execute-api.ap-southeast-1.amazonaws.com/dev';
    const SHOP_ID = import.meta.env.VITE_SHOP_ID || 'shop-active-01';
    ```
- Declare `guestApi` and `customerApi` Axios instances to isolate headers and prevent corss-tier credential leakage:
    ```typescript
    export const guestApi = axios.create({ 
        baseURL: GUEST_BASE_URL, 
        timeout: 10000 
    });

    guestApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const gt = localStorage.getItem('gt');
        if (gt) config.headers.Authorization = `Bearer ${gt}`;
        return config;
    }, (error) => Promise.reject(error));

    export const customerApi = axios.create({ 
        baseURL: CUSTOMER_BASE_URL, 
        timeout: 10000 
    });

    customerApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    }, (error) => Promise.reject(error))
    ```
- Implement `checkSession` function to verify what the user tier is:
    - If `token` exists, inject it into `Authorization` with `Bearer ${token}>` for customerApi
    - If `gt` exists, inject it into `Authorization` with `Bearer ${gt}>` for guestApi
    - If no session tokens exist, provision a fresh guest identity following workflow below:
        - Generate `ref` by `generateRandomRef` function preioviously.
        - Dispatch Guest API request: `POST /shops/{shop_id}/guests` with `ref` parameter.
        - Extract returned token using `GenericResponse<GuestSession>` and set `token` in localStorage under `gt` key.
        - Cache the active instance and provide `getApiInstance` function to return active instance.
- Finally, dispatches an explicit `GET /shops/{shop_id}` network call using the guest API client instance from `getApiInstance` by its own function `fetchShopConfig` by not using guest session.

### 4. Root Application Setup (`src/App.tsx`)
- **Bootstrapping Core**: Manages the application initialization sequence within a linear useEffect block with an empty dependency array ([]). This ensures authentication checking and store configuration loading happen only on initial page load or hard browser refreshes.
- Runs await `checkSession()` to finalize auth and verify the network configuration layer before executing await `fetchShopConfig()`.
- Commit the retrieved shop config to state, passing it straight down to the runtime `<ShopProvider />` layer.
- Render `<LoadingIndicator fullPage />` (`src/components/LoadingIndicator.tsx`) during initial system hydration.

### 5. List Product API (`src/api/api.ts`)
- Create a function, called `ListProducts()`, to fetch list of current products under shop ID: `GET /shops/{shop_id}/products?lang=<current_lang>`.
- See API response in `docs/openapi/guest/openapi.yaml`
- Load `current_lang` from `localStorage` under the `lang` key.

### 6. Synchronize Landing Page Data (`src/pages/Landing.tsx`)
- Fetch products using `ListProducts()` in `src/api/api.ts`.
- Integrate the pre-existing Landing Page layout with live shop configuration from the contexy layout and products on component layout execution.

## 🏁 Task Verification Requirements
- Run local compilation verification scripts via `npm run build` to guarantee zero TypeScript or build errors exist.
- Edit `tasks/manifest.json`, switch the status value for Task 03 from "pending" to "completed", and stop.
# Task 03: Authentication, Session Management, and Shop Initialization

## 🎯 Objective

Initialize the application session and fetch storefront configurations on initial application boot (or hard refresh). Once loaded, this state is preserved in memory and shared globally, allowing instant client-side page transitions without redundant network requests or UI blocking.

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

### 5. Synchronize Landing Page Data (`src/pages/Landing.tsx`)
- Integrate the pre-existing Landing Page layout with live shop configuration from the context layout.

## 🏁 Task Verification Requirements
You are strictly required to execute the following verification steps and terminal operations sequentially from top to bottom before closing this task:
* **Verify Branding**: Check that `/branding/BRANDING.md` exists exactly at that path and matches the token mapping completely.
* **Verify Tailwind**: Ensure `src/index.css` successfully compiles without any unexpected syntax parser errors.
* **Run Linting**: Execute `npm run lint` in your terminal and fix any style errors immediately.
* **Run Build**: Execute `npm run build` in your terminal to ensure the codebase compiles with zero errors.
* **Error Loop**: If linting or build fails, fix the code and repeat the tests. Do not mark the task complete if a check fails.
* **Manifest Handshake**: Once all tests pass, open `tasks/manifest.json` and change this task's status from "pending" to "completed".
* **Log Progress**: Append a brief summary of your changes to the top of `PROGRESS.md` using the format in `AGENTS.md`, then stop.
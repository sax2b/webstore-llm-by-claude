# STYLING_UI.md - Global Styling & UI Constraints

## DOs
*   **DO** strictly apply the explicit hexadecimal colors, radiuses, and shadows defined in `branding/BRANDING.md` using standard Tailwind utility syntax.
*   **DO** use the exact font family stack and **16px** base body text metrics defined in `branding/BRANDING.md`. to the existing global CSS (`@import` or `font-face` in `src/index.css`).
*   **DO** strictly use Tailwind's **4px base unit** scales (e.g., `p-1`, `p-2`, `p-4`, `p-8`).
*   **DO** design for mobile phones first. Test that elements stack nicely and do not break on small screens (320px wide).
*   **DO** make your background colors and layouts stretch 100% wide (`w-full`). Only restrict container widths (`max-w-...`) when making readable blocks of text.
*   **DO** add smooth transitions and animations where appropriate:
    - Use `transition-all`, `transition-colors`, `transition-opacity` for hover states
    - Use `animate-fade-in`, `animate-pulse`, `animate-bounce` for engaging UI elements
    - Add `hover:scale-105` or `hover:scale-110` for interactive elements
    - Use `transform` and transition utilities for smooth interactions
*   **DO** combine Tailwind utilities rather than writing custom CSS.

## DON'Ts
*   **DON'T** use non-standard semantic theme aliases like `bg-background`, `text-foreground`, or `border-border`. Use pure standard Tailwind classes only.
*   **DON'T** use inline styles (`style={{ }}`) or inject custom CSS/`<style jsx>` tags.
*   **DON'T** create any new CSS files; use only the existing global `src/index.css`.
*   **DON'T** hardcode static pixel widths (`w-[375px]`) for structural parent layout elements.
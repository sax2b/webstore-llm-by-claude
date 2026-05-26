# INCREMENTAL_CHANGES.md - Incremental Changes & Code Preservation

## DOs
*   **DO** check `src/App.tsx` first to evaluate what structural components already exist before writing anything new.
*   **DO** make targeted changes to existing files instead of rewriting whole components.
*   **DO** change ONLY the specific text, color, or utility class requested.
*   **DO** keep all existing imports, logic, functions, and state exactly as-is.
*   **DO** edit a maximum of 1 file for text/style tweaks, and 2 files for new features.

## DON'Ts
*   **DON'T** edit or ripple changes across more than 3 files for a single request, STOP - you're doing too much.
*   **DON'T** recreate any configuration files (`package.json`, `tailwind.config.js`, `vite.config.ts`) during routine edits or feature updates.
*   **DON'T** recreate files that already exist.
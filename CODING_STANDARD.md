# CODING_STANDARD.md - Code Quality and Syntax Standards

## DOs
*   **DO** write 100% complete files from top to bottom with zero code truncation. If you run out of space, prioritize completing the current file, or generate fewer total files, but make them 100% complete.
*   **DO** close all tags, quotes, brackets, and parentheses completely.
*   **DO** convert smart/curly quotes to straight quotes:
    - ’ and ‘ → '
    - ” and “ → "
    - Any other Unicode quotes → straight quotes
*   **DO** escape apostrophes safely (`'don\'t'`) or use double quotes (`"don't"`).

## DON'Ts
*   **DON'T** use emojis in any code, text, console logs, or UI elements.
*   **DON'T** write raw SVG paths, use icons from `lucid-react` or `heroicons` instead.
*   **DON'T** leave placeholders, `// TODO` items, or shorthand comments like `// rest of code`.
*   **DON'T** stop mid-response to ask the user for permission to continue or use artificial `<continue>` tags.
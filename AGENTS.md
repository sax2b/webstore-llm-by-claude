# AGENTS.md

## Project Overview
This repository functions as an **AI-ready template** designed to systematically construct fully operational webstores. It provides automated workflows, pre-mapped design systems, and explicit API layers so an AI agent can ingest user prompts and compile a customized web store with zero human friction.

## 📁 Workspace Context Hierarchy
| Context File | Description |
| :--- | :--- |
| **1. `CODING_STANDARD.md`** | Code completeness rules, syntax guardrails, and forbidden formats. |
| **2. `INCREMENTAL_CHANGES.md`** | Maximum file change limits, file preservation, and scope boundaries. |
| **3. `STYLING_UI.md`** | Tailwind utility constraints, layout fluidity, and responsive rules. |
| **4. `PROGRESS.md`** | The Agent Action Log. Read this to understand all historical changes made to the project. |
| **5. `tasks/`** | Isolated step-by-step implementation tasks. |

## Workflow
- **1. Locate Pending Task**: Open `tasks/manifest.json`. Scan the execution sequence to find the first task where the status parameter is currently set to "pending".
- **2. Pre-Flight Context Initialization**: Scan that task file for a `Connected References` section:
  * **IF Connected References EXIST:** You must halt linear execution immediately. Open and read **ONLY** the specific files explicitly listed as literal strings under that exact heading. You are strictly forbidden from reading, scanning, or parsing any other unlisted architectural files in the workspace at this stage. Before generating code, print a short list of these loaded files to prove compliance.
  * **IF Connected References DO NOT EXIST:** Proceed directly to Step 3.
- **3. Analyze & Implement**: Process the step-by-step implementation requirements inside the task file. Modify and write all files fully from top to bottom with absolute zero truncation or placeholder shortcuts.
- **4. Linting Verification**: Run the project's static analysis tool to ensure the written code strictly adheres to style and quality rules without warning or error:
  ```bash
  npm run lint
  ```
- **5. Compilation Check**: Run a full production build script check after any file modification to guarantee code and style injections compile flawlessly with no errors:
  ```bash
  npm run build
  ```
- **6. Runtime Verification:** Spin up the local development engine to verify that the application servers successfully without client-side exceptions:
  ```bash
  npm run dev
  ```
- **7. Manifest Handshake & Loop**:
  - **FAILURE**: If either check fails, immediately fix the errors, preserve existing codebase integrity, and return directly to the **Linting Verification** step. Do not modify the manifest status until all errors are resolved.
  - **SUCCESS**: If the application passes both the build and runtime verification checks, perform the actions below:
  * Update `tasks/manifest.json` by changing that task's status parameter cleanly to "completed".
  * Append a new, concise record of your work to the top of PROGRESS.md using the exact markdown format below. This file serves as your primary external memory bank; when context is clear or reset, you will rely entirely on reading this single file to understand everything that has been done across the whole project. Do not include future plans or notes; record only what was successfully compiled.
  * If no focused task file, add N/A in `Task File` topic
  
## Expected `PROGRESS.md` Entry Format

```markdown
### ✅ [2026-05-29 18:55] - Implemented Stripe Checkout Pipeline
* **Task File:** `tasks/04-stripe-integration.md`
* **Files Modified:** 
  * `src/api/checkout.js`
  * `src/components/Cart.jsx`
* **Changes Delivered:**
  * Created secure serverless function to generate Stripe checkout sessions.
  * Embedded redirect trigger on the client-side cart checkout component.
  * Integrated webhooks to handle successful payment events securely.
```
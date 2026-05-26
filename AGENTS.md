# AGENTS.md

## Project Overview
This repository functions as an **AI-ready template** designed to systematically construct fully operational webstores. It provides automated workflows, pre-mapped design systems, and explicit API layers so an AI agent can ingest user prompts and compile a customized web store with zero human friction.

## 📁 Workspace Context Hierarchy
1. `SYSTEM.md` (Absolute core behavioral constraints, engine parameters, and coding laws)
2. `tasks/` (Isolated step-by-step implementation files)

## Workflow
- Read `SYSTEM.md` for core architecture and UI constraints.
- **Locate Pending Task**: Open `tasks/manifest.json`. Scan the execution sequence to find the first task where the status parameter is currently set to "pending".
- **Analyze Requirements**: Open the corresponding task Markdown file inside the `tasks/` directory and implement all files fully with absolute zero truncation.
- **Compilation Check**: Run a full production build script check after any file modification to guarantee code and style injections compile flawlessly with no errors:
  ```bash
  npm run build
  ```
- **Runtime Verification:** Spin up the local development engine to verify that the application servers successfully without client-side exceptions:
  ```bash
  npm run dev
  ```
- **Manifest Handshake**:
  - Once the application passes both validation checks, update tasks/manifest.json by changing the completed task's status parameter cleanly to "completed".
  - `IF` the build fails: Fix the errors right away, then back to `Compilation Check` step again.
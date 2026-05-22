# Task 02: JSON Design Ingestion

## 🎯 Objective
Ingest active custom design system tokens from your workspace configuration tracking files, create/rewrite the global `BRANDING.md` specification dictionary, and inject the layout palette parameters straight into your primary layout engine stylesheets to standardize webstore theme configurations.
---

## 🧱 Implementation Requirements & Steps

### 1. Ingest Active Configuration File Profile
- Look inside your project root for design parameters using this explicit checklist priority loop:
  1. Scan for **`branding/branding.json`** (Web-scraped design system priority target).
  2. If missing, look for and ingest **`branding/default.json`** to serve as the structural fallback profile.
- Whichever profile file matches, treat those specific values as your absolute configuration source of truth for the steps below.

### 2. Generate BRANDING.md (Strict Formatting Guide)
- Read the active parameters from your target JSON layout configurations.
- Create or completely overwrite **`BRANDING.md`** in your project root. The agent must format the markdown output to match this exact template layout structural format:

```markdown
# BRANDING.md

BRAND GUIDELINES

COLOR SYSTEM:
- Color Scheme: [light or dark based on colorScheme]
- Primary Color: [HEX string mapping to colors.primary or 'not specified']
- Accent Color: [HEX string mapping to colors.accent or 'not specified']
- Background: [HEX string mapping to colors.background or 'not specified']
- Text Primary: [HEX string mapping to colors.textPrimary or 'not specified']
- Link Color: [HEX string mapping to colors.link or 'not specified']

TYPOGRAPHY:
- Primary Font: [String mapping to typography.fontFamilies.primary or 'system default']
- Heading Font: [String mapping to typography.fontFamilies.heading or 'system default']
- Font Stack (Body): [Comma separated list mapping to typography.fontStacks.body or 'system-ui, sans-serif']
- Font Stack (Heading): [Comma separated list mapping to typography.fontStacks.heading or 'system-ui, sans-serif']
- H1 Size: [String mapping to typography.fontSizes.h1 or '36px']
- H2 Size: [String mapping to typography.fontSizes.h2 or '30px']
- Body Size: [String mapping to typography.fontSizes.body or '16px']

SPACING & LAYOUT:
- Base Spacing Unit: [Integer mapping to spacing.baseUnit or '4']px
- Border Radius: [String mapping to spacing.borderRadius or '6px']

BUTTON STYLES:
Primary Button:
- Background: [HEX string mapping to components.buttonPrimary.background or colors.primary]
- Text Color: [HEX string mapping to components.buttonPrimary.textColor or '#ffffff']
- Border Radius: [String mapping to components.buttonPrimary.borderRadius or spacing.borderRadius or '8px']
- Shadow: [String mapping to components.buttonPrimary.shadow or 'none']

Secondary Button:
- Background: [HEX string mapping to components.buttonSecondary.background or '#F9F9F9']
- Text Color: [HEX string mapping to components.buttonSecondary.textColor or colors.textPrimary]
- Border Radius: [String mapping to components.buttonSecondary.borderRadius or spacing.borderRadius or '8px']
- Shadow: [String mapping to components.buttonSecondary.shadow or 'none']

INPUT FIELDS:
- Border Color: [Hex string mapping to components.input.borderColor or '#CCCCCC']
- Border Radius: [String mapping to components.input.borderRadius or spacing.borderRadius or '6px']

BRAND PERSONALITY:
- Tone: [String mapping to personality.tone or 'professional']
- Energy: [String mapping to personality.energy or 'medium']
- Target Audience: [String mapping to personality.targetAudience or 'general']

DESIGN SYSTEM:
- Framework: [String mapping to designSystem.framework or 'tailwind']
- Component Library: [String mapping to designSystem.componentLibrary or 'custom']

ASSETS:
- Logo: [String representation mapping to images.favicon or 'Not available']
```

### 3. Inject Style Palette Layout directly into CSS Layers
- Open the single workspace styling asset located precisely at: src/index.css.
- Preserve the top @tailwind directives exactly as they stand.
- Underneath the base directives, update or inject a global styling block mapping the ingested configuration fields using standard, explicit Tailwind @layer base modifiers to avoid layout-breaking custom style flags:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Inject Ingested Color Palette Tokens and Global Typography Variables */
  body {
    font-family: [Insert comma separated Font Stack (Body) value here, e.g., 'Noto Sans Thai Looped', sans-serif];
    font-size: [Insert Body Size string value here, e.g., 16px];
    background-color: [Insert Background HEX string here, e.g., #F5F5F5];
    color: [Insert Text Primary HEX string here, e.g., #2C2C2C];
    -webkit-font-smoothing: antialiased;
  }

  /* Lock Header Layout Text Scalings Strictly to User Specification Mapping */
  h1 {
    font-family: [Insert comma separated Font Stack (Heading) value here];
    font-size: [Insert H1 Size string value here, e.g., 36px];
    font-weight: 700;
  }

  h2 {
    font-family: [Insert comma separated Font Stack (Heading) value here];
    font-size: [Insert H2 Size string value here, e.g., 30px];
    font-weight: 700;
  }
}
```
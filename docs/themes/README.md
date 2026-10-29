# Ionic Themes

The Ionic Framework uses a modular theme system that separates core functionality from visual styling. Each theme is distributed in the [@ionic/theme](https://www.npmjs.com/package/@ionic/theme) package.

## Directory Structure

```bash
core/
└── src/
    └── themes/
        ├── base/
        │   ├── default.tokens.ts   # Base design tokens shared across all themes
        │   ├── dark.tokens.ts      # Dark mode tokens shared across all themes
        │   └── light.tokens.ts     # Light mode tokens shared across all themes
        │
        ├── ionic/
        │   ├── default.tokens.ts   # Ionic theme default design tokens
        │   ├── dark.tokens.ts      # Ionic theme dark mode tokens
        │   └── light.tokens.ts     # Ionic theme light mode tokens
        │
        ├── ios/
        │   ├── default.tokens.ts   # iOS theme default design tokens
        │   ├── dark.tokens.ts      # iOS theme dark mode tokens
        │   └── light.tokens.ts     # iOS theme light mode tokens
        │
        ├── md/
        │   ├── default.tokens.ts   # MD theme default tokens
        │   ├── dark.tokens.ts      # MD theme dark mode tokens
        │   └── light.tokens.ts     # MD theme light mode tokens
        │
        ├── functions.color.scss    # Sass color utility functions
        ├── functions.font.scss     # Sass font and typography functions
        ├── functions.sizes.scss    # Sass sizing and spacing functions
        ├── functions.string.scss   # Sass string manipulation functions
        │
        └── mixins.scss             # Sass mixins
```

## Component Files

A component that uses the theme system keeps its recipe and config types next to its source:

```bash
core/src/components/my-component/
├── my-component.tsx            # Reads config defaults and renders CSS custom properties
├── my-component.scss           # Single base stylesheet for every theme
├── my-component.interface.ts   # Recipe and config types, plus const arrays for prop values
└── my-component.constant.ts    # Optional shared values, such as defaults
```

- Name the interface and constant files in the singular: `my-component.interface.ts` and `my-component.constant.ts`.
- Back each prop union with a `const` array, such as `ION_CHIP_SIZES`, so tests can loop over every value.

## Available Themes

### iOS Theme (`@ionic/theme/ios`)
- **Design System**: iOS Human Interface Guidelines
- **Usage**: `import '@ionic/theme/ios'`

### Material Design Theme (`@ionic/theme/md`)
- **Design System**: Material Design
- **Usage**: `import '@ionic/theme/md'`

### Ionic Theme (`@ionic/theme/ionic`)
- **Design System**: Ionic-branded design system
- **Usage**: `import '@ionic/theme/ionic'`

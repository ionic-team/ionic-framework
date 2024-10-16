# Ionic Design Tokens

## What are Design Tokens?

Design Tokens are an abstract and universal language to store Design System values, creating a single source of truth that is tech-agnostic and easily scalable and extendable for various outputs such as CSS, SCSS, iOS, Android, JSON, and more. Typically stored in JSON format, they facilitate seamless scalability for integration with any language or Design Tool like Figma or Sketch.

Design tokens represent small, repeated design decisions that make up a design system's visual style. Tokens replace static values, like hex codes representing colors, with descriptive and intuitive names.

## Design Tokens Architecture

The Ionic Design Tokens are stored on `core/src/foundations/tokens`. Here we have the abstract primitive tokens that will be common between all themes.
Inside the `core/src/foundations/tokens/theme` we have the tokens that are specific to the new IOnic Theme, like primary colors, font-family and color states.

Currently, six categories of tokens are stored:

- Colors
- Font
- Scale
- Border
- Elevation
- Z-index

Using [Style Dictionary](https://amzn.github.io/style-dictionary/), these tokens generate 2 files inside `core/src/foundations`:

- `ionic.vars.scss` - SCSS variables, based on the native ones, that are used internally on all CSS/SCSS code.
- `ionic.utility.scss` - list of utility classes based on each Design Token.

This refers, more or less, to what's known as System Tokens, which are decisions that systematize the design language for a specific theme or context.

Currently, Reference Tokens and Component Tokens are not used. Instead we are defining a base architecture for system tokens, that will inform the `:root` and global SCSS variables, and then we let the SCSS architecture propagate that to the Components.

## Format

The latest [W3C Design Tokens Format](https://design-tokens.github.io/community-group/format/) was adhered to, this is a recent effort to normalize the nomenclature of Design Tokens.

The nomenclature has the following structure: `type - type variation - modifier name - $value`

Example:

```json
{
  "color": {
    "$type": "color",
    "primary": {
      "10": {
        "$value": "#f7faff"
      }
    }
  }
}
```

The `tokens.js` script, responsible for generating CSS and SCSS variables along with utility classes, will follow the same nomenclature: `prefix - CSS property name - type variation - modifier name`.

Examples: 

SCSS Variable:

```scss
$ion-color-primary-100
```

Utility class:

```css
.ion-color-primary-100
```

## When to change the Design Tokens

It's not expected that the `design-tokens.json` needs to be changed frequently. This represents the base of all the Ionic Design System and any change to the json file should be taken carefully, synced with the UX/UI Team and reviewed by other devs.

Adding new tokens is more or less risk free. However, changing values will result in visual breaking changes and renaming tokens might cause the build to be broken.

## How to change the Design Tokens

Using `npm run build.tokens` will generate the `ionic.root.scss`, `ionic.vars.scss`, and `ionic.utility.scss` files with the updated values that come from the `design-tokens.json`.

Design Tokens will also be generated automatically with the `npm run build` command. This ensures that if someone modifies the JSON without running the build tokens command, the changes will be applied correctly.

## How to use

It's very important to highlight that only the Ionic Theme supports these tokens and they should not be used for md/ios themes.

Within the component scope, variables from these global tokens should always be used. There should be no hardcoded values on component scope that relate to any of the existing tokens.

To prevent differences between components implementation, a global partial was created - `ionic.globals.scss` - that forwards all the necessary foundations, functions and mixins, relevant to the Ionic Theme.

Usage example (Chip Component):

```scss
@use '../../themes/ionic/ionic.globals.scss' as globals;

:host {
  --background: #{globals.$ion-primitives-neutral-100};
  color: globals.$ion-primitives-neutral-900;
  @include globals.font-smoothing;
}
```

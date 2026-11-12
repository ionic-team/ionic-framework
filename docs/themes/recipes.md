# Recipe Conventions

A recipe is the typed object that lists every design token a component accepts. Each path in it becomes a CSS custom property:

```
IonChip.hue.bold.solid.default.background
→ --ion-chip-hue-bold-solid-default-background
```

The recipe type lives in the component's `.interface.ts` file, and each theme sets its values in `core/src/themes/<theme>/default.tokens.ts`. This page records the conventions recipes follow, so new components stay consistent and settled decisions don't get reopened.

## Naming

### Name keys for people, not for CSS

A key should tell a front-end developer or designer what it controls without reading the stylesheet. Most keys match the CSS property, but add grouping levels where they carry meaning, such as a state (`hover`, `focus`), a variant (`size.small`) or `semantic` for a component with a `color` set.

### Nest keys that share a CSS prefix

When other CSS properties start with the same word, that word becomes an object, even if only one of its keys is used today:

```ts
border: { radius?, color?, width?, style? }   // not borderRadius
min: { height? }                              // not minHeight
line: { height? }                             // not lineHeight
```

Use camel case only when no other CSS property shares the first word, such as `letterSpacing` and `zIndex`. The generated variable is the same either way (`--ion-chip-min-height`), so this only changes the TypeScript shape.

### Use the shared spacing types

`padding` and `margin` use `IonPadding` and `IonMargin` from `themes.interfaces.ts`, which have `top`, `end`, `bottom` and `start` keys. Logical names keep the tokens correct in right-to-left layouts.

### Call a focus indicator `ring`

A focus indicator drawn around the component is `ring: { color, style, width }`, as in `IonChip.state.focus.ring`.

- `border` would collide with the component's real border, which a focused state can also change.
- `outline` would collide with the `outline` fill and names the CSS property rather than what people see.

## Structure

### Hues, fills and states

Colors that vary by hue and fill nest in that order, with the resting colors under `default` and each state as a sibling:

```ts
hue: {
  bold: {
    solid: {
      default: { background, color },
      hover: { background },
      focus: { background },
      activated: { background },
      disabled: { background },

      // Used when the component has a `color` set
      semantic: {
        default: { background, color },
        hover: { background },
      },
    },
  },
},
```

A state only lists what it changes. In the stylesheet, states are written in the order focus, hover, activated, disabled, so a later state wins when two apply.

### Shared states

Values that change with a state but not with the hue go in a top-level `state` object, such as `IonChip.state.disabled.opacity` and `IonChip.state.focus.ring`.

### Resting values stay at the top level

When a shared state overrides a value that doesn't vary by hue, the resting value stays at the top level of the recipe, and `state` only holds the override. There is no `state.default`:

```ts
text: { decoration: 'none' },
state: {
  focus: { text: { decoration: 'underline' } },
},
```

If resting values moved into `state.default`, adding the first state to a property would rename its variable.

## Values

### Set a value in every theme

When one theme needs a value, set it in every theme's `default.tokens.ts` rather than relying on a `var()` fallback in the stylesheet. A fallback assumes a default that a new theme might not want, and an unset token still applies its declaration as `unset`.

Fallbacks are only for these cases:

- `0px` inside `calc()`
- `inherit` for properties such as `font-family`, since a custom property can't hold the `inherit` keyword
- a value that only exists on a child element, since a token's `var()` resolves on the parent
- rendering with no theme loaded
- `revert-layer` on a `::slotted()` property, so a theme that leaves the token out keeps the child's own value
- a state falling back to its resting token, such as `var(--ion-chip-hue-bold-solid-hover-background, var(--ion-chip-hue-bold-solid-default-background))`, so a theme only lists the states it changes

### A recipe key doesn't need a token

The recipe describes everything an app can customize. When a value is the same in every theme and the stylesheet already supplies it as a `var()` fallback, the themes can leave it out. For example, `IonSkeletonText.border.radius` has no theme value and falls back to `inherit`.

### Use the palette helpers for colors

In the themes Ionic ships (ionic, ios and md), build colors from the palette so they follow light, dark and high contrast palettes:

- `ionColor('primary', 'shade', { subtle: true })` for a named color
- `currentColor('base', { alpha: 0.12 })` for the component's `color`, inside `semantic`
- `baseColors.backgroundColor` and the other shared values from `themes/base/shared.tokens.ts`

Don't reference external `--token-*` variables in them. A custom theme can set any value it needs.

### Keep theme checks out of components

Theme differences belong in tokens and stylesheets. Don't add `getIonTheme()` calls; key behavior off a token or the layout instead.

## Parents and children

### A parent's recipe nests the child it styles

A parent that changes a child's look sets the child's tokens from its own recipe. The child keeps its own token names and never knows about its parents:

```ts
IonDatetime: {
  IonButton: {
    size: {
      medium: {
        padding: { top: '3px', end: '5px', bottom: '3px', start: '5px' },
      },
    },
  },
},
```

Key names tell the two shapes apart:

- **A capitalized key**, such as `IonButton`, is another component. It accepts that component's full recipe.
- **A lowercase key**, such as `rippleEffect` or `icon`, is a part of the component you're in. It accepts only the keys listed for it, and the parent's stylesheet applies them.

Under a parent, `semantic` means the parent has a `color` set, as in `IonToolbar.semantic.IonButton`.

### Size slotted children directly

A parent can't resize a slotted child through the child's custom property, because the token rule in the document stylesheet wins over the parent's shadow styles. Set the property directly on `::slotted()` instead:

```scss
::slotted(ion-avatar) {
  width: var(--ion-item-divider-avatar-width, revert-layer);
}
```

## Types and files

- Put the recipe and config types in the component's singular `.interface.ts` file, and add both to `themes.interfaces.ts`.
- Back each prop union with a `const` array, such as `ION_CHIP_SIZES`, so tests can loop over every value.
- Reuse a shared union when one exists, such as `Hue` and `HUES`, instead of declaring a component copy.
- Name a variable that a component sets from its own script `--internal-*`, and leave it out of the recipe.
- In a new migration, document each token with a `@prop` comment in a Sass partial next to the stylesheet, `_my-component.docs.scss`, loaded with `@use "./my-component.docs";` at the top of `my-component.scss`. Stencil reads the comments from the compiled CSS, so they still reach the docs site and `api.txt`, and the stylesheet stays readable.

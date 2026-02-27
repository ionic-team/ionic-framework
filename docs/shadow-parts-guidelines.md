# CSS Shadow Parts Guidelines

<sub><b>TABLE OF CONTENTS</b></sub>
- [Definitions](#definitions)
- [Scope](#scope)
- [General Guidelines](#general-guidelines)
- [Standard Parts](#standard-parts)
- [Specialized Parts](#specialized-parts)
- [Documentation](#documentation)

## Definitions

**CSS Shadow Parts:** The CSS shadow parts module defines the [::part()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::part) pseudo-element that can be set on a [shadow host](https://developer.mozilla.org/en-US/docs/Glossary/Shadow_tree). Using this pseudo-element, you can enable shadow hosts to expose the selected element in the shadow tree to the outside page for styling purposes. [^1]

## Scope

Ionic Framework components that use Shadow DOM expose CSS Shadow Parts to enable custom styling by end users.

This document establishes a standardized naming convention for CSS Shadow Parts in Ionic Framework components.

## General Guidelines

1. **Attempt to use standard parts first**: Use `native`, `wrapper`, `inner`, `container`, and `content` wherever they apply before inventing new names.
2. **Use semantic, kebab-case names**: Choose descriptive names that communicate the role of the element (for example, `detail-icon`, `supporting-text`).
3. **Reuse names for the same concept**: Use the same part name across components when the element serves the same role (for example, `backdrop`, `handle`, `label`).

## Standard Parts

**Name parts by what the element does, not where it appears.** Ask what role the element plays:

| Name | Role |
| --- | --- |
| `native` | Is it a native HTML element that the user interacts with (e.g. `<button>`, `<a>`, `<input>`, `<textarea>`)? |
| `wrapper` | Is it a native `<label>` element that wraps the whole form control? |
| `inner` | Is it the inner layout wrapper around the main content? It may wrap only the default slot (e.g. `ion-list-header`), or a container plus slot(s) (e.g. `ion-item`, `ion-item-divider`, `ion-item-option`) when present. |
| `container` | Does it wrap the main content itself (default slot or native control)? |
| `content` | Is it the main user-content area of an overlay or primary content region? |

The following examples show the correct usage for the standard parts.

### `native`

**What it does:** The element the user directly interacts with - the native button, anchor, or form control (e.g. `<button>`, `<a>`, `<textarea>`, `<input>`).

- **Use when**: The element receives click/focus/input from the user.
- **Examples**: `ion-item`, `ion-button`, `ion-textarea`.

**ion-item** - the interactive element is the `<button>`, `<a>`, or `<div>` (`TagType`):

```tsx
const TagType = clickable ? (href === undefined ? 'button' : 'a') : ('div' as any);

return (
  <Host>
    <TagType class="item-native" part="native">
      <slot name="start"></slot>
      <div class="item-inner" part="inner">
        <div class="input-wrapper" part="container">
          <slot></slot>
        </div>
        <slot name="end"></slot>
      </div>
    </TagType>
  </Host>
);
```

**ion-textarea** - the interactive element is the native `<textarea>`:

```tsx
<div class="native-wrapper" part="container">
  <textarea class="native-textarea" part="native">
    {value}
  </textarea>
</div>
```

### `wrapper`

**What it does:** The HTML `<label>` element that wraps the entire form control. Clicking anywhere on it focuses the control.

- **Use when**: The element is the `<label>` that wraps the form control.
- **Examples**: `ion-select`, `ion-textarea`, `ion-input`, `ion-checkbox`, `ion-toggle`, `ion-radio`, `ion-range`.

**ion-select** - the `<label>` has `part="wrapper"`:

```tsx
<label class="select-wrapper" part="wrapper">
  {this.renderLabelContainer()}
  <div class="select-wrapper-inner" part="inner">
    <slot name="start"></slot>
    <div class="native-wrapper" part="container">...</div>
    <slot name="end"></slot>
  </div>
</label>
```

**ion-textarea** - the `<label>` has `part="wrapper"`:

```tsx
<label class="textarea-wrapper" part="wrapper">
  {this.renderLabelContainer()}
  <div class="textarea-wrapper-inner" part="inner">
    <slot name="start"></slot>
    <div class="native-wrapper" part="container">...</div>
    <slot name="end"></slot>
  </div>
</label>
```

### `inner`

**What it does:** The inner layout wrapper around the main content. It may wrap only the default slot (e.g. `ion-list-header`), or it may wrap a container and the slot(s) (e.g. `start`, `end`) that sit alongside the main content. In `ion-item`, and `ion-item-divider`, the `start` slot is a sibling of this element. In `ion-select`, both `start` and `end` slots are inside this element.

- **Use when**: The element is the inner layout wrapper (with or without a separate container and `start`/`end` slots).
- **Examples**: `ion-list-header` (`.list-header-inner` wraps only the default slot), `ion-item` (`.item-inner`), `ion-item-divider` (`.item-divider-inner`), `ion-select` (`.select-wrapper-inner`).

**ion-list-header** - `.list-header-inner` wraps only the default slot (no container, no `start`/`end` slots):

```tsx
<div class="list-header-inner" part="inner">
  <slot></slot>
</div>
```

**ion-item** - `.item-inner` wraps the container and `end` slot (`start` slot is a sibling):

```tsx
<slot name="start"></slot>
<div class="item-inner" part="inner">
  <div class="input-wrapper" part="container">
    <slot></slot>
  </div>
  <slot name="end"></slot>
</div>
```

**ion-item-divider** - `.item-divider-inner` wraps the container and `end` slot (`start` slot is a sibling):

```tsx
<slot name="start"></slot>
<div class="item-divider-inner" part="inner">
  <div class="item-divider-wrapper" part="container">
    <slot></slot>
  </div>
  <slot name="end"></slot>
</div>
```

**ion-select** - `.select-wrapper-inner` arranges `start` slot, container, `end` slot:

```tsx
<div class="select-wrapper-inner" part="inner">
  <slot name="start"></slot>
  <div class="native-wrapper" part="container"></div>
  <slot name="end"></slot>
</div>
```

### `container`

**What it does:** Wraps the main content - either the default slot (for item-like components) or the native control and its immediate content (for form controls like select, textarea).

- **Use when**: The element wraps the default slot, or wraps the native control (and any immediate content like listbox or slots inside it).
- **Don’t use when**: The element is the main content area of an overlay (use `content` instead).
- **Examples**: `ion-item` (`.input-wrapper` around default slot), `ion-item-divider` (`.item-divider-wrapper`), `ion-select` (`.native-wrapper` around select text + listbox), `ion-textarea` (`.native-wrapper` around `<textarea>`).

From the examples above:

**ion-item** - `.input-wrapper` wraps the default `<slot>`:

```tsx
<slot name="start"></slot>
<div class="item-inner" part="inner">
  <div class="input-wrapper" part="container">
    <slot></slot>
  </div>
  <slot name="end"></slot>
</div>
```

**ion-select** - `.native-wrapper` wraps the select text and listbox:

```tsx
<div class="select-wrapper-inner" part="inner">
  <slot name="start"></slot>
  <div class="native-wrapper" part="container">
    {this.renderSelectText()}
    {this.renderListbox()}
  </div>
  <slot name="end"></slot>
</div>
```

**ion-textarea** - `.native-wrapper` wraps the `<textarea>`:

```tsx
<label class="textarea-wrapper" part="wrapper">
  {this.renderLabelContainer()}
  <div class="textarea-wrapper-inner" part="inner">
    <slot name="start"></slot>
    <div class="native-wrapper" part="container">
      <textarea class="native-textarea" part="native">
        {value}
      </textarea>
    </div>
    <slot name="end"></slot>
  </div>
</label>
```

### `content`

**What it does:** The main user-content area of an overlay or the primary content region (e.g. modal body, toolbar’s main slot).

- **Use when**: The element is the primary content area where users see the main content (overlay body, or primary slot inside something like a toolbar).
- **Examples**: `ion-modal`, `ion-popover`, `ion-accordion`, `ion-toolbar` (the div that wraps the default slot inside the toolbar container).

**ion-modal** - `content` wraps the default `<slot>` which is the primary content:

```tsx
<div class="modal-content" part="content">
  <slot></slot>
</div>
```

**ion-toolbar** - `content` wraps the default `<slot>` which is the primary content:

```tsx
<div class="toolbar-container" part="container">
  <slot name="start"></slot>
  <slot name="secondary"></slot>
  <div class="toolbar-content" part="content">
    <slot></slot>
  </div>
  <slot name="primary"></slot>
  <slot name="end"></slot>
</div>
```

## Specialized Parts

Components may also expose specialized parts for specific elements. The following parts are reused across multiple components:

| Name | Description |
| --- | --- |
| `background` | Background elements (e.g., `ion-content`, `ion-toolbar`) |
| `backdrop` | Backdrop elements. **Must only be used on `<ion-backdrop>` components.** (e.g., `ion-modal`, `ion-popover`, `ion-menu`) |
| `label` | Label text elements - not the HTML `<label>` (see standard part `wrapper`) |
| `supporting-text` | Supporting text elements |
| `helper-text` | Helper text elements |
| `error-text` | Error text elements |
| `icon` | Icon elements. **Must only be used on `<ion-icon>` components.** Use specific names like `detail-icon`, `close-icon` when the icon serves a distinct purpose (e.g., `ion-item` uses `detail-icon`, `ion-fab-button` uses `close-icon`) |
| `handle` | Handle elements (e.g., `ion-modal`, `ion-toggle`) |
| `track` | Track elements (e.g., `ion-toggle`, `ion-progress-bar`) |
| `mark` | Checkmark or indicator marks (e.g., `ion-checkbox`, `ion-radio`) |

**When to create new specialized parts:**
- Use standard parts (`native`, `wrapper`, `inner`, `container`, `content`) when they apply
- Reuse existing specialized parts (listed above) when they match the element's role
- Create component-specific specialized parts for elements that don't fit standard patterns or existing specialized parts
- Use descriptive, semantic names (e.g., `header`, `text`, `arrow`, `scroll` for component-specific elements)

## Documentation

Shadow parts must be documented in the component's JSDoc comments using the `@part` tag. The following example demonstrates the proper documentation format:

```tsx
/**
 * @part native - The native HTML button, anchor or div element that wraps all child elements.
 * @part inner - The inner container element that wraps the item content.
 * @part container - The wrapper element that contains the default slot.
 * @part detail-icon - The chevron icon for the item. Only applies when `detail="true"`.
 */
```

[^1]: MDN Documentation - CSS shadow parts, https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Shadow_parts

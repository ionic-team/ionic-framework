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

1. **Attempt to use standard parts first**: Use `native`, `inner`, `content`, and `container` wherever they apply before inventing new names.
2. **Use semantic, kebab-case names**: Choose descriptive names that communicate the role of the element (for example, `detail-icon`, `supporting-text`).
3. **Reuse names for the same concept**: Use the same part name across components when the element serves the same role (for example, `backdrop`, `handle`, `label`).

## Standard Parts

### `native`

The native HTML element (button, anchor, or div) that wraps all child elements.

- **Use when**: Component renders a native HTML element
- **Examples**: `ion-button`, `ion-item`, `ion-card`
- **Code examples**:
  ```tsx
  // Back Button - Always renders a button tag
  return (
    <Host>
      <button class="button-native" part="native">
        <slot></slot>
      </button>
    </Host>
  );
  ```

  ```tsx
  // Breadcrumb - Checks if href is set to determine the native tag type
  const TagType = this.href === undefined ? 'span' : 'a';

  return (
    <Host>
      <TagType part="native">
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>
      </TagType>
    </Host>
  );
  ```

### `inner`

The inner container element that wraps the component's content structure.

- **Use when**: You need a structural inner container that doesn't necessarily wrap slots or user-visible content
- **Examples**: `ion-item`, `ion-item-divider`, `ion-item-option`, `ion-list-header`
- **Code examples**:
  ```tsx
  // Item
  return (
    <Host>
      <button part="native">
        <slot name="start"></slot>
        <div class="item-inner" part="inner">
          <div class="input-wrapper" part="content">
            <slot></slot>
          </div>
          <slot name="end"></slot>
        </div>
      </button>
    </Host>
  );
  ```

  ```tsx
  // Item Divider
  return (
    <Host>
      <slot name="start"></slot>
      <div class="item-divider-inner" part="inner">
        <div class="item-divider-wrapper" part="content">
          <slot></slot>
        </div>
        <slot name="end"></slot>
      </div>
    </Host>
  );
  ```

  ```tsx
  // Item Option
  return (
    <Host>
      <button class="button-native" part="native">
        <span class="button-inner" part="inner">
          <slot name="top"></slot>
          <div class="horizontal-wrapper" part="container">
            <slot name="start"></slot>
            <slot name="icon-only"></slot>
            <slot></slot>
            <slot name="end"></slot>
          </div>
          <slot name="bottom"></slot>
        </span>
      </button>
    </Host>
  );
  ```

  ```tsx
  // List Header
  return (
    <Host>
      <div class="list-header-inner" part="inner">
        <slot></slot>
      </div>
    </Host>
  );
  ```

### `content`

The wrapper element for the default slot (or a semantically named `content` slot).

- **Use when**: Wrapping the default slot or semantically named content slot
- **Examples**: `ion-item`, `ion-item-divider`, `ion-popover`, `ion-modal`, `ion-accordion`
- **Code examples**:
  ```tsx
  // Item - Wraps only the default slot
  return (
    <Host>
      <button part="native">
        <slot name="start"></slot>
        <div class="item-inner" part="inner">
          <div class="input-wrapper" part="content">
            <slot></slot>
          </div>
          <slot name="end"></slot>
        </div>
      </button>
    </Host>
  );
  ```

  ```tsx
  // Accordion - Wraps the named "content" slot
  return (
    <Host>
      <div id="header" part="header">
        <slot name="header"></slot>
      </div>

      <div id="content" part="content">
        <div id="content-wrapper">
          <slot name="content"></slot>
        </div>
      </div>
    </Host>
  );
  ```

  ```tsx
  // Toolbar - Coexists with other slots at the same level
  return (
    <Host>
      <div class="toolbar-background" part="background"></div>
      <div class="toolbar-container" part="container">
        <slot name="start"></slot>
        <slot name="secondary"></slot>
        <div class="toolbar-content" part="content">
          <slot></slot>
        </div>
        <slot name="primary"></slot>
        <slot name="end"></slot>
      </div>
    </Host>
  );
  ```

### `container`

A wrapper element that contains multiple slots, multiple rendered elements, or specialized parts.

- **Use when**: Wrapping multiple slots together, multiple rendered elements, or specialized parts
- **Don't use when**: Wrapping only the default slot (use `content` instead)
- **Examples**: `ion-item-option` (multiple slots), `ion-toolbar` (multiple slots), `ion-toast` (multiple elements), `ion-checkbox` (specialized parts)
- **Code examples**:
  ```tsx
  // Toolbar - Wraps multiple slots together
  return (
    <Host>
      <div class="toolbar-background" part="background"></div>
      <div class="toolbar-container" part="container">
        <slot name="start"></slot>
        <slot name="secondary"></slot>
        <div class="toolbar-content" part="content">
          <slot></slot>
        </div>
        <slot name="primary"></slot>
        <slot name="end"></slot>
      </div>
    </Host>
  );
  ```

  ```tsx
  // Select - Wraps multiple rendered elements
  return (
    <Host>
      <label class="select-wrapper">
        {this.renderLabelContainer()}
        <div class="select-wrapper-inner">
          <slot name="start"></slot>
          <div class="native-wrapper" part="container">
            <div class="select-text" part="text"></div>
            <button></button>
          </div>
          <slot name="end"></slot>
        </div>
      </label>
    </Host>
  );
  ```

  ```tsx
  // Checkbox - Wraps specialized parts
  return (
    <Host>
      <label class="checkbox-wrapper">
        <input type="checkbox" />
        <div class="label-text-wrapper" part="label">
          <slot></slot>
        </div>
        <div class="native-wrapper">
          <svg class="checkbox-icon" viewBox="0 0 24 24" part="container">
            <path d="M6 12L18 12" part="mark" />
          </svg>
        </div>
      </label>
    </Host>
  );
  ```

## Specialized Parts

Components may also expose specialized parts for specific elements. The following parts are reused across multiple components:

| Name | Description |
| --- | --- |
| `background` | Background elements (e.g., `ion-content`, `ion-toolbar`) |
| `backdrop` | Backdrop elements. **Must only be used on `<ion-backdrop>` components.** (e.g., `ion-modal`, `ion-popover`, `ion-menu`) |
| `label` | Label text elements |
| `supporting-text` | Supporting text elements |
| `helper-text` | Helper text elements |
| `error-text` | Error text elements |
| `icon` | Icon elements. **Must only be used on `<ion-icon>` components.** Use specific names like `detail-icon`, `close-icon` when the icon serves a distinct purpose (e.g., `ion-item` uses `detail-icon`, `ion-fab-button` uses `close-icon`) |
| `handle` | Handle elements (e.g., `ion-modal`, `ion-toggle`) |
| `track` | Track elements (e.g., `ion-toggle`, `ion-progress-bar`) |
| `mark` | Checkmark or indicator marks (e.g., `ion-checkbox`, `ion-radio`) |

**When to create new specialized parts:**
- Use standard parts (`native`, `inner`, `content`, `container`) when they apply
- Reuse existing specialized parts (listed above) when they match the element's role
- Create component-specific specialized parts for elements that don't fit standard patterns or existing specialized parts
- Use descriptive, semantic names (e.g., `header`, `text`, `arrow`, `scroll` for component-specific elements)

## Documentation

Shadow parts must be documented in the component's JSDoc comments using the `@part` tag. The following example demonstrates the proper documentation format:

```tsx
/**
 * @part native - The native HTML button, anchor or div element that wraps all child elements.
 * @part inner - The inner container element that wraps the item content.
 * @part content - The wrapper element that contains the default slot.
 * @part detail-icon - The chevron icon for the item. Only applies when `detail="true"`.
 */
```

[^1]: MDN Documentation - CSS shadow parts, https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Shadow_parts

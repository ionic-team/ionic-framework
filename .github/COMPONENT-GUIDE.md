# Ionic Component Implementation

## Button States

Any component that renders a button should have the following states: [`activated`](#activated), [`disabled`](#disabled), [`focused`](#focused), [`hover`](#hover).

### References

- [Material Design States](https://material.io/design/interaction/states.html)
- [iOS Buttons](https://developer.apple.com/design/human-interface-guidelines/ios/controls/buttons/)

### Activated

TODO

### Disabled

TODO

### Focused

TODO

### Hover

The [hover state](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) happens when a user moves their cursor on top of an element without pressing on it. It should not happen on mobile, only on desktop devices that support hover.

#### JavaScript

A native button should be rendered with the following structure:

```jsx
<Host>
  <button class="button-native">
    <span class="button-inner">
      <slot></slot>
    </span>
  </button>
</Host>
```

Any other attributes and classes that are included are irrelevant to hover, but it's important that this structure is followed and the classes above exist.

#### CSS

Components should be written to include the following hover variables for styling:

```css
 /**
   * @prop --background-hover: Background of the button on hover
   * @prop --background-hover-opacity: Opacity of the background on hover
   */
```

These styles should be set for the CSS to work properly:

```scss
.button-native {
  /**
  * All other CSS in this selector is irrelevant to hover
  * but the following are required styles
  */

  position: relative;
}

.button-native::after {
  @include button-state();
}

.button-inner {
  /**
    * All other CSS in this selector is irrelevant to hover
    * but the following are required styles
    */

  position: relative;

  z-index: 1;
}

@media (any-hover: hover) {
  :host(:hover) .button-native::after {
    background: var(--background-hover);

    opacity: var(--background-hover-opacity, 0);
  }
}
```

The `button-state()` mixin was created to automatically add the following styles:

```scss
@mixin button-state() {
  @include position(0, 0, 0, 0);

  position: absolute;

  border-radius: inherit;

  content: "";

  opacity: 0;
}
```

#### User Customization

Setting the hover state on the `::after` pseudo-element allows the user to customize the hover state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on hover, or they can leave out `--background-hover-opacity` and the button will use the default hover.

```css
ion-button {
  --background-hover: red;
  --background-hover-opacity: 1;
}
```
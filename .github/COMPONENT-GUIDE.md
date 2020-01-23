# Ionic Component Implementation Guide

- [Button States](#button-states)
  * [Component Structure](#component-structure)
  * [Activated](#activated)
  * [Disabled](#disabled)
  * [Focused](#focused)
  * [Hover](#hover)
  * [Ripple Effect](#ripple-effect)
  * [Example Components](#example-components)
  * [References](#references)
- [Rendering Anchor or Button](#rendering-anchor-or-button)
  * [Example Components](#example-components-1)
  * [Component Structure](#component-structure-1)
- [Converting Scoped to Shadow](#converting-scoped-to-shadow)

## Button States

Any component that renders a button should have the following states: [`activated`](#activated), [`disabled`](#disabled), [`focused`](#focused), [`hover`](#hover). It should also have a [Ripple Effect](#ripple-effect) component added for Material Design.

### Component Structure

#### JavaScript

A component that renders a native button should use the following structure:

```jsx
<Host>
  <button class="button-native">
    <span class="button-inner">
      <slot></slot>
    </span>
  </button>
</Host>
```

Any other attributes and classes that are included are irrelevant to the button states, but it's important that this structure is followed and the classes above exist. In some cases they may be named something else that makes more sense, such as in item.


#### CSS

A mixin called `button-state()` has been added to make it easier to setup the states in each component.

```scss
@mixin button-state() {
  @include position(0, 0, 0, 0);

  position: absolute;

  content: "";

  opacity: 0;
}
```

The following styles should be set for the CSS to work properly. Note that the `button-state()` mixin is included in the `::after` pseudo element of the native button.

```scss
.button-native {
  /**
   * All other CSS in this selector is irrelevant to button states
   * but the following are required styles
   */

  position: relative;

  overflow: hidden;
}

.button-native::after {
  @include button-state();
}

.button-inner {
  /**
   * All other CSS in this selector is irrelevant to button states
   * but the following are required styles
   */

  position: relative;

  z-index: 1;
}
```


### Activated

The activated state should be enabled for elements with actions on "press". It usually changes the opacity or background of an element.

> Make sure the component has the correct [component structure](#component-structure) before continuing.

#### JavaScript

The `ion-activatable` class needs to be set on an element that can be activated:

```jsx
render() {
  return (
    <Host class='ion-activatable'>
      <slot></slot>
    </Host>
  );
}
```

Once that is done, the element will get the `ion-activated` class added on press.

In addition to setting that class, `ion-activatable-instant` can be set in order to have an instant press with no delay:

```jsx
<Host class='ion-activatable ion-activatable-instant'>
```

#### CSS

```css
 /**
   * @prop --color-activated: Color of the button when pressed
   * @prop --background-activated: Background of the button when pressed
   * @prop --background-activated-opacity: Opacity of the background when pressed
   */
```

Style the `ion-activated` class based on the spec for that element:

```scss
:host(.ion-activated) .button-native {
  color: var(--color-activated);

  &::after {
    background: var(--background-activated);

    opacity: var(--background-activated-opacity);
  }
}
```

> Order is important! Activated should be before the focused & hover states.


#### User Customization

Setting the activated state on the `::after` pseudo-element allows the user to customize the activated state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on press, or they can leave out `--background-activated-opacity` and the button will use the default activated opacity to match the spec.

```css
ion-button {
  --background-activated: red;
  --background-activated-opacity: 1;
}
```


### Disabled

The disabled state should be set via prop on all components that render a native button. Setting a disabled state will change the opacity or color of the button and remove click events from firing.

#### JavaScript

The `disabled` property should be set on the component:

```jsx
/**
  * If `true`, the user cannot interact with the button.
  */
@Prop({ reflectToAttr: true }) disabled = false;
```

Then, the render function should add the [`aria-disabled`](https://www.w3.org/WAI/PF/aria/states_and_properties#aria-disabled) role to the host, a class that is the element tag name followed by `disabled`, and pass the `disabled` attribute to the native button:

```jsx
render() {
  const { disabled } = this;

  return (
    <Host
      aria-disabled={disabled ? 'true' : null}
      class={{
        'button-disabled': disabled
      }}
    >
      <button disabled={disabled}>
        <slot></slot>
      </button>
    </Host>
  );
}
```

> Note: if the class being added was for `ion-back-button` it would be `back-button-disabled`.

#### CSS

The following CSS _at the bare minimum_ should be added for the disabled class, but it should be styled to match the spec:

```css
:host(.button-disabled) {
  cursor: default;
  opacity: .5;
  pointer-events: none;
}
```

#### User Customization

TODO

### Focused

The focused state should be enabled for elements with actions when tabbed to via the keyboard. This will only work inside of an `ion-app`. It usually changes the opacity or background of an element.

> Make sure the component has the correct [component structure](#component-structure) before continuing.

#### JavaScript

The `ion-focusable` class needs to be set on an element that can be focused:

```jsx
render() {
  return (
    <Host class='ion-focusable'>
      <slot></slot>
    </Host>
  );
}
```

Once that is done, the element will get the `ion-focused` class added when the element is tabbed to.

#### CSS

Components should be written to include the following focused variables for styling:

```css
 /**
   * @prop --color-focused: Color of the button when tabbed to with the keyboard
   * @prop --background-focused: Background of the button when tabbed to with the keyboard
   * @prop --background-focused-opacity: Opacity of the background when tabbed to with the keyboard
   */
```

Style the `ion-focused` class based on the spec for that element:

```scss
:host(.ion-focused) .button-native {
  color: var(--color-focused);

  &::after {
    background: var(--background-focused);

    opacity: var(--background-focused-opacity);
  }
}
```

> Order is important! Focused should be after the activated and before the hover state.


#### User Customization

Setting the focused state on the `::after` pseudo-element allows the user to customize the focused state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on focus, or they can leave out `--background-focused-opacity` and the button will use the default focus opacity to match the spec.

```css
ion-button {
  --background-focused: red;
  --background-focused-opacity: 1;
}
```


### Hover

The [hover state](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) happens when a user moves their cursor on top of an element without pressing on it. It should not happen on mobile, only on desktop devices that support hover.

> Make sure the component has the correct [component structure](#component-structure) before continuing.

#### CSS

Components should be written to include the following hover variables for styling:

```css
 /**
   * @prop --color-hover: Color of the button on hover
   * @prop --background-hover: Background of the button on hover
   * @prop --background-hover-opacity: Opacity of the background on hover
   */
```

Style the `:hover` based on the spec for that element:

```scss
@media (any-hover: hover) {
  :host(:hover) .button-native {
    color: var(--color-hover);

    &::after {
      background: var(--background-hover);

      opacity: var(--background-hover-opacity);
    }
  }
}
```

> Order is important! Hover should be after the activated and focused states.


#### User Customization

Setting the hover state on the `::after` pseudo-element allows the user to customize the hover state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on hover, or they can leave out `--background-hover-opacity` and the button will use the default hover opacity to match the spec.

```css
ion-button {
  --background-hover: red;
  --background-hover-opacity: 1;
}
```


### Ripple Effect

The ripple effect should be added to elements for Material Design. It *requires* the `ion-activatable` class to be set on the parent element to work, and relative positioning on the parent.

```jsx
 render() {
  const mode = getIonMode(this);

return (
  <Host
    class={{
      'ion-activatable': true,
    }}
  >
    <button>
      <slot></slot>
      {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
    </button>
  </Host>
);
```

The ripple effect can also accept a different `type`. By default it is `"bounded"` which will expand the ripple effect from the click position outwards. To add a ripple effect that always starts in the center of the element and expands in a circle, set the type to `"unbounded"`. An unbounded ripple will exceed the container, so add `overflow: hidden` to the parent to prevent this.

Make sure to style the ripple effect for that component to accept a color:

```css
ion-ripple-effect {
  color: var(--ripple-color);
}
```


### Example Components

- [ion-button](https://github.com/ionic-team/ionic/tree/master/core/src/components/button)
- [ion-back-button](https://github.com/ionic-team/ionic/tree/master/core/src/components/back-button)
- [ion-menu-button](https://github.com/ionic-team/ionic/tree/master/core/src/components/menu-button)

### References

- [Material Design States](https://material.io/design/interaction/states.html)
- [iOS Buttons](https://developer.apple.com/design/human-interface-guidelines/ios/controls/buttons/)


## Rendering Anchor or Button

Certain components can render an `<a>` or a `<button>` depending on the presence of an `href` attribute.

### Example Components

- [ion-button](https://github.com/ionic-team/ionic/tree/master/core/src/components/button)
- [ion-card](https://github.com/ionic-team/ionic/tree/master/core/src/components/card)
- [ion-fab-button](https://github.com/ionic-team/ionic/tree/master/core/src/components/fab-button)
- [ion-item-option](https://github.com/ionic-team/ionic/tree/master/core/src/components/item-option)
- [ion-item](https://github.com/ionic-team/ionic/tree/master/core/src/components/item)

### Component Structure

#### JavaScript

In order to implement a component with a dynamic tag type, set the property that it uses to switch between them, we use `href`:

```jsx
/**
 * Contains a URL or a URL fragment that the hyperlink points to.
 * If this property is set, an anchor tag will be rendered.
 */
@Prop() href: string | undefined;
```

Then use that in order to render the tag:

```jsx
render() {
  const TagType = href === undefined ? 'button' : 'a' as any;

  return (
    <Host>
      <TagType>
        <slot></slot>
      </TagType>
    </Host>
  );
}
```

If the component can render an `<a>`, `<button>` or a `<div>` add in more properties such as a `button` attribute in order to check if it should render a button.

## Converting Scoped to Shadow

### CSS

There will be some CSS issues when converting to shadow. Below are some of the differences.

**Targeting host + slotted child**

```css
/* IN SCOPED */
:host(.ion-color)::slotted(ion-segment-button)

/* IN SHADOW*/
:host(.ion-color) ::slotted(ion-segment-button)
```

**Targeting host-context + host (with a :not)**

```css
/* IN SCOPED */
:host-context(ion-toolbar.ion-color):not(.ion-color) {

/* IN SHADOW */
:host-context(ion-toolbar.ion-color):host(:not(.ion-color))  {
```

**Targeting host-context + host (with a :not) > slotted child**

```css
/* IN SCOPED */
:host-context(ion-toolbar:not(.ion-color)):not(.ion-color)::slotted(ion-segment-button) {

/* IN SHADOW*/
:host-context(ion-toolbar:not(.ion-color)):host(:not(.ion-color)) ::slotted(ion-segment-button) {
```

# Ionic Component Implementation Guide

- [Button States](#button-states)
  * [Component Structure](#component-structure)
  * [Disabled](#disabled)
  * [Focused](#focused)
  * [Hover](#hover)
  * [Activated](#activated)
  * [Ripple Effect](#ripple-effect)
  * [Example Components](#example-components)
  * [References](#references)
- [Accessibility](#accessibility)
  * [Checkbox](#checkbox)
  * [Switch](#switch)
  * [Accordion](#accordion)
- [Rendering Anchor or Button](#rendering-anchor-or-button)
  * [Example Components](#example-components-4)
  * [Component Structure](#component-structure-1)
- [Converting Scoped to Shadow](#converting-scoped-to-shadow)
- [RTL](#rtl)
- [Adding New Components with Native Input Support](#adding-new-components-with-native-input-support)
  * [Angular Integration](#angular-integration)
  * [Angular Tests](#angular-tests)
  * [Vue Integration](#vue-integration)
  * [Vue Tests](#vue-tests)
  * [React Integration](#react-integration)
  * [React Tests](#react-tests)
  * [Interface Exports](#interface-exports)

## Button States

Any component that renders a button should have the following states: [`disabled`](#disabled), [`focused`](#focused), [`hover`](#hover), [`activated`](#activated). It should also have a [Ripple Effect](#ripple-effect) component added for Material Design.

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

> [!NOTE]
> If the class being added was for `ion-back-button` it would be `back-button-disabled`.

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

> [!WARNING]
> Do not use `:focus` because that will cause the focus to apply even when an element is tapped (because the element is now focused). Instead, we only want the focus state to be shown when it makes sense which is what the `.ion-focusable` utility mentioned below does.

> [!IMPORTANT]
> Make sure the component has the correct [component structure](#component-structure) before continuing.

#### JavaScript

The `ion-focusable` class needs to be set on an element that can be focused:

```jsx
render() {
  return (
    <Host class="ion-focusable">
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

> [!IMPORTANT]
> Order matters! Focused should be **before** the activated and hover states.


#### User Customization

Setting the focused state on the `::after` pseudo-element allows the user to customize the focused state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on focus, or they can leave out `--background-focused-opacity` and the button will use the default focus opacity to match the spec.

```css
ion-button {
  --background-focused: red;
  --background-focused-opacity: 1;
}
```

#### When to use `.ion-focusable` versus `:focus-visible`

The [`:focus-visible`](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible) pseudo-class mostly does the same thing as our JavaScript-driven utility. However, it does not work well with Shadow DOM components as the element that receives focus is typically inside of the Shadow DOM, but we usually want to set the `:focus-visible` state on the host so we can style other parts of the component.

Using other combinations such as `:has(:focus-visible)` does not work because `:has` does not pierce the Shadow DOM (as that would leak implementation details about the Shadow DOM contents). `:focus-within` does work with the Shadow DOM, but that has the same problem as `:focus` that was mentioned before. Unfortunately, a [`:focus-visible-within` pseudo-class does not exist yet](https://github.com/WICG/focus-visible/issues/151).

The `.ion-focusable` class should be used when you want to style Element A based on the state of Element B. For example, the Button component styles the host of the component (Element A) when the native `button` inside the Shadow DOM (Element B) has focus.

On the other hand, the `:focus-visible` pseudo-class can be used when you want to style the element based on its own state. For example, we could use `:focus-visible` to style the clear icon on Input when the icon itself is focused.

### Hover

The [hover state](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) happens when a user moves their cursor on top of an element without pressing on it. It should not happen on mobile, only on desktop devices that support hover.

> [!NOTE]
> Some Android devices [incorrectly report their inputs](https://issues.chromium.org/issues/40855702) which can result in certain devices receiving hover events when they should not.

> [!IMPORTANT]
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

> [!IMPORTANT]
> Order matters! Hover should be **before** the activated state.


#### User Customization

Setting the hover state on the `::after` pseudo-element allows the user to customize the hover state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on hover, or they can leave out `--background-hover-opacity` and the button will use the default hover opacity to match the spec.

```css
ion-button {
  --background-hover: red;
  --background-hover-opacity: 1;
}
```


### Activated

The activated state should be enabled for elements with actions on "press". It usually changes the opacity or background of an element.

> [!WARNING]
>`:active` should not be used here as it is not received on mobile Safari unless the element has a `touchstart` listener (which we don't necessarily want to have to add to every element). From [Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html):
>
>> On iOS, mouse events are sent so quickly that the down or active state is never received. Therefore, the `:active` pseudo state is triggered only when there is a touch event set on the HTML element

> [!IMPORTANT]
> Make sure the component has the correct [component structure](#component-structure) before continuing.

#### JavaScript

The `ion-activatable` class needs to be set on an element that can be activated:

```jsx
render() {
  return (
    <Host class="ion-activatable">
      <slot></slot>
    </Host>
  );
}
```

Once that is done, the element will get the `ion-activated` class added on press after a small delay. This delay exists so that the active state does not show up when an activatable element is tapped while scrolling.

In addition to setting that class, `ion-activatable-instant` can be set in order to have an instant press with no delay:

```jsx
<Host class="ion-activatable ion-activatable-instant">
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

> [!IMPORTANT]
> Order matters! Activated should be **after** the focused & hover states.

#### User Customization

Setting the activated state on the `::after` pseudo-element allows the user to customize the activated state without knowing what the default opacity is set at. A user can customize in the following ways to have a solid red background on press, or they can leave out `--background-activated-opacity` and the button will use the default activated opacity to match the spec.

```css
ion-button {
  --background-activated: red;
  --background-activated-opacity: 1;
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

- [ion-button](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/button)
- [ion-back-button](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/back-button)
- [ion-menu-button](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/menu-button)

### References

- [Material Design States](https://material.io/design/interaction/states.html)
- [iOS Buttons](https://developer.apple.com/design/human-interface-guidelines/ios/controls/buttons/)


## Accessibility

### Checkbox

#### Example Components

- [ion-checkbox](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/checkbox)

#### VoiceOver

In order for VoiceOver to work properly with a checkbox component there must be a native `input` with `type="checkbox"`, and `aria-checked` and `role="checkbox"` **must** be on the host element. The `aria-hidden` attribute needs to be added if the checkbox is disabled, preventing iOS users from selecting it:

```tsx
render() {
  const { checked, disabled } = this;

  return (
    <Host
      aria-checked={`${checked}`}
      aria-hidden={disabled ? 'true' : null}
      role="checkbox"
    >
      <input
        type="checkbox"
      />
      ...
    </Host>
  );
}
```

#### NVDA

It is required to have `aria-checked` on the native input for checked to read properly and `disabled` to prevent tabbing to the input:

```tsx
render() {
  const { checked, disabled } = this;

  return (
    <Host
      aria-checked={`${checked}`}
      aria-hidden={disabled ? 'true' : null}
      role="checkbox"
    >
      <input
        type="checkbox"
        aria-checked={`${checked}`}
        disabled={disabled}
      />
      ...
    </Host>
  );
}
```

#### Labels

Labels should be passed directly to the component in the form of either visible text or an `aria-label`. The visible text can be set inside of a `label` element, and the `aria-label` can be set directly on the interactive element.

In the following example the `aria-label` can be inherited from the Host using the `inheritAttributes` or `inheritAriaAttributes` utilities. This allows developers to set `aria-label` on the host element since they do not have access to inside the shadow root.

> [!NOTE]
> Use `inheritAttributes` to specify which attributes should be inherited or `inheritAriaAttributes` to inherit all of the possible `aria` attributes.

```tsx
import { Prop } from '@stencil/core';
import { inheritAttributes } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';

...

private inheritedAttributes: Attributes = {};

@Prop() labelText?: string;

componentWillLoad() {
  this.inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
}

render() {
  return (
    <Host>
      <label>
        {this.labelText}
        <input type="checkbox" {...this.inheritedAttributes} />
      </label>
    </Host>
  )
}
```

#### Hidden Input

A helper function to render a hidden input has been added, it can be added in the `render`:

```tsx
renderHiddenInput(true, el, name, (checked ? value : ''), disabled);
```

> This is required for the checkbox to work with forms.

#### Known Issues

When using VoiceOver on macOS, Chrome will announce the following when you are focused on a checkbox:

```
currently on a checkbox inside of a checkbox
```

This is a compromise we have to make in order for it to work with the other screen readers & Safari.


### Switch

#### Example Components

- [ion-toggle](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/toggle)

#### Voiceover

In order for VoiceOver to work properly with a switch component there must be a native `input` with `type="checkbox"` and `role="switch"`, and `aria-checked` and `role="switch"` **must** be on the host element. The `aria-hidden` attribute needs to be added if the switch is disabled, preventing iOS users from selecting it:

```tsx
render() {
  const { checked, disabled } = this;

  return (
    <Host
      aria-checked={`${checked}`}
      aria-hidden={disabled ? 'true' : null}
      role="switch"
    >
      <input
        type="checkbox"
        role="switch"
      />
      ...
    </Host>
  );
}
```

#### NVDA

It is required to have `aria-checked` on the native input for checked to read properly and `disabled` to prevent tabbing to the input:

```tsx
render() {
  const { checked, disabled } = this;

  return (
    <Host
      aria-checked={`${checked}`}
      aria-hidden={disabled ? 'true' : null}
      role="switch"
    >
      <input
        type="checkbox"
        role="switch"
        aria-checked={`${checked}`}
        disabled={disabled}
      />
      ...
    </Host>
  );
}
```

#### Labels

Labels should be passed directly to the component in the form of either visible text or an `aria-label`. The visible text can be set inside of a `label` element, and the `aria-label` can be set directly on the interactive element.

In the following example the `aria-label` can be inherited from the Host using the `inheritAttributes` or `inheritAriaAttributes` utilities. This allows developers to set `aria-label` on the host element since they do not have access to inside the shadow root.

> [!NOTE]
> Use `inheritAttributes` to specify which attributes should be inherited or `inheritAriaAttributes` to inherit all of the possible `aria` attributes.

```tsx
import { Prop } from '@stencil/core';
import { inheritAttributes } from '@utils/helpers';
import type { Attributes } from '@utils/helpers';

...

private inheritedAttributes: Attributes = {};

@Prop() labelText?: string;

componentWillLoad() {
  this.inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
}

render() {
  return (
    <Host>
      <label>
        {this.labelText}
        <input type="checkbox" role="switch" {...this.inheritedAttributes} />
      </label>
    </Host>
  )
}
```

#### Hidden Input

A helper function to render a hidden input has been added, it can be added in the `render`:

```tsx
renderHiddenInput(true, el, name, (checked ? value : ''), disabled);
```

> This is required for the switch to work with forms.


#### Known Issues

When using VoiceOver on macOS or iOS, Chrome will announce the switch as a checked or unchecked `checkbox`:

```
You are currently on a switch. To select or deselect this checkbox, press Control-Option-Space.
```

There is a WebKit bug open for this: https://bugs.webkit.org/show_bug.cgi?id=196354

### Accordion

#### Example Components

- [ion-accordion](https://github.com/ionic-team/ionic-framework/tree/master/core/src/components/accordion)
- [ion-accordion-group](https://github.com/ionic-team/ionic-framework/tree/master/core/src/components/accordion-group)

#### NVDA

In order to use the arrow keys to navigate the accordions, users must be in "Focus Mode". Typically, NVDA automatically switches between Browse and Focus modes when inside of a form, but not every accordion needs a form.

You can either wrap your `ion-accordion-group` in a form, or manually toggle Focus Mode using NVDA's keyboard shortcut.


## Rendering Anchor or Button

Certain components can render an `<a>` or a `<button>` depending on the presence of an `href` attribute.

### Example Components

- [ion-button](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/button)
- [ion-card](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/card)
- [ion-fab-button](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/fab-button)
- [ion-item-option](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/item-option)
- [ion-item](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components/item)

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

## RTL

When you need to support both LTR and RTL modes, try to avoid using values such as `left` and `right`. For certain CSS properties, you can use the appropriate mixin to have this handled for you automatically.

For example, if you wanted `transform-origin` to be RTL-aware, you would use the `transform-origin` mixin:

```css
@include transform-origin(start, center);
```

This would output `transform-origin: left center` in LTR mode and `transform-origin: right center` in RTL mode.

These mixins depend on the `:host-context` pseudo-class when used inside of shadow components, which is not supported in WebKit. As a result, these mixins will not work in Safari for macOS and iOS when applied to shadow components.

To work around this, you should set an RTL class on the host of your component and set your RTL styles by targeting that class:

```tsx
<Host
class={{
  'my-cmp-rtl': document.dir === 'rtl'
}}
>
 ...
</Host>
```

```css
:host {
  transform-origin: left center;
}

:host(.my-cmp-rtl) {
  transform-origin: right center;
}
```

## Adding New Components with Native Input Support

When creating a new component that renders native input elements (such as `<input>` or `<textarea>`), there are several steps required to ensure proper form integration across all frameworks (Angular, React, and Vue).

### Angular Integration

#### Value Accessors

For Angular integration, you should use one of the existing value accessors based on your component's needs. Choose the one that most closely matches your component's behavior:

- For text input (handles string values): Use [`TextValueAccessorDirective`](/packages/angular/src/directives/control-value-accessors/text-value-accessor.ts) which handles `ion-input:not([type=number])`, `ion-input-otp[type=text]`, `ion-textarea`, and `ion-searchbar`
- For numeric input (converts string to number): Use [`NumericValueAccessorDirective`](/packages/angular/src/directives/control-value-accessors/numeric-value-accessor.ts) which handles `ion-input[type=number]`, `ion-input-otp:not([type=text])`, and `ion-range`
- For boolean input (handles true/false): Use [`BooleanValueAccessorDirective`](/packages/angular/src/directives/control-value-accessors/boolean-value-accessor.ts) which handles `ion-checkbox` and `ion-toggle`
- For select-like input (handles option selection): Use [`SelectValueAccessorDirective`](/packages/angular/src/directives/control-value-accessors/select-value-accessor.ts) which handles `ion-select`, `ion-radio-group`, `ion-segment`, and `ion-datetime`

These value accessors are already set up in the `@ionic/angular` package and handle all the necessary form integration. You don't need to create a new value accessor unless your component has unique requirements that aren't covered by these existing ones.

For example, if your component renders a text input, it should be included in the `TextValueAccessorDirective` selector in [`text-value-accessor.ts`](/packages/angular/src/directives/control-value-accessors/text-value-accessor.ts):

```diff
@Directive({
-  selector: 'ion-input:not([type=number]),ion-input-otp[type=text],ion-textarea,ion-searchbar',
+  selector: 'ion-input:not([type=number]),ion-input-otp[type=text],ion-textarea,ion-searchbar,ion-new-component',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextValueAccessorDirective,
      multi: true,
    },
  ],
})
```

You'll also need to add your component's type to the value accessor's type definitions. For example, in the `TextValueAccessorDirective`, you would add your component's type to the `_handleInputEvent` method:

```diff
@HostListener('ionInput', ['$event.target'])
_handleInputEvent(
-  el: HTMLIonInputElement | HTMLIonInputOtpElement | HTMLIonTextareaElement | HTMLIonSearchbarElement
+  el: HTMLIonInputElement | HTMLIonInputOtpElement | HTMLIonTextareaElement | HTMLIonSearchbarElement | HTMLIonNewComponentElement
): void {
  this.handleValueChange(el, el.value);
}
```

If your component needs special handling for value changes, you'll also need to update the `registerOnChange` method. For example, if your component needs to handle numeric values:

```diff
registerOnChange(fn: (_: number | null) => void): void {
-  if (this.el.nativeElement.tagName === 'ION-INPUT' || this.el.nativeElement.tagName === 'ION-INPUT-OTP') {
+  if (this.el.nativeElement.tagName === 'ION-INPUT' || this.el.nativeElement.tagName === 'ION-INPUT-OTP' || this.el.nativeElement.tagName === 'ION-NEW-COMPONENT') {
    super.registerOnChange((value: string) => {
      fn(value === '' ? null : parseFloat(value));
    });
  } else {
    super.registerOnChange(fn);
  }
}
```

#### Standalone Directive

For standalone components, create a directive in the [standalone package](/packages/angular/standalone/src/directives). Look at the implementation of the most similar existing component as a reference:

- For text/numeric inputs: See [ion-input](/packages/angular/standalone/src/directives/input.ts) or [ion-input-otp](/packages/angular/standalone/src/directives/input-otp.ts)
- For boolean inputs: See [ion-checkbox](/packages/angular/standalone/src/directives/checkbox.ts) or [ion-toggle](/packages/angular/standalone/src/directives/toggle.ts)
- For select-like inputs: See [ion-select](/packages/angular/standalone/src/directives/select.ts) or [ion-radio-group](/packages/angular/standalone/src/directives/radio-group.ts)

After creating the directive, you need to export it in two places:

1. First, add your component to the directives export group in [`packages/angular/standalone/src/directives/index.ts`](/packages/angular/standalone/src/directives/index.ts):

```typescript
export { IonNewComponent } from './new-component';
```

2. Then, add it to the main standalone package's index file in [`packages/angular/standalone/src/index.ts`](/packages/angular/standalone/src/index.ts):

```typescript
export {
  IonCheckbox,
  IonDatetime,
  IonInput,
  IonInputOtp,
  IonNewComponent, // Add your new component here
  // ... other components
} from './directives';
```

This ensures your component is properly exported and available for use in standalone Angular applications.

### Angular Tests

Add tests for the new component to the existing Angular test files:

- **(Lazy) Inputs**
  - [`inputs.component.html`](/packages/angular/test/base/src/app/lazy/inputs/inputs.component.html)
  - [`inputs.component.ts`](/packages/angular/test/base/src/app/lazy/inputs/inputs.component.ts)
  - [`inputs.spec.ts`](/packages/angular/test/base/e2e/src/lazy/inputs.spec.ts)
- **(Lazy) Form**
  - [`form.component.html`](/packages/angular/test/base/src/app/lazy/form/form.component.html)
  - [`form.component.ts`](/packages/angular/test/base/src/app/lazy/form/form.component.ts)
  - [`form.spec.ts`](/packages/angular/test/base/e2e/src/lazy/form.spec.ts)
- **(Standalone) Value Accessors**
  - [`value-accessors/`](/packages/angular/test/base/src/app/standalone/value-accessors)
  - [`value-accessors.spec.ts`](/packages/angular/test/base/e2e/src/standalone/value-accessors.spec.ts)

These files contain tests for form integration and input behavior. Review how similar components are tested and add the new component to the relevant test files.

### Vue Integration

#### Output Target Configuration

Update the `vueOutputTarget` configuration in `stencil.config.ts` to include the new component:

```typescript
vueOutputTarget({
  // ... other config
  componentModels: [
    {
      elements: ['ion-new-component'],
      targetAttr: 'value', // or 'checked' for boolean inputs
      event: 'ion-input', // or 'ion-change' depending on the component
    }
  ]
})
```

Choose the `targetAttr` and `event` based on your component's behavior:
- For text/numeric inputs: Use `targetAttr: 'value'` and `event: 'ion-input'` (like `ion-input` and `ion-textarea`)
- For boolean inputs: Use `targetAttr: 'checked'` and `event: 'ion-change'` (like `ion-checkbox` and `ion-toggle`)
- For select-like inputs: Use `targetAttr: 'value'` and `event: 'ion-change'` (like `ion-select` and `ion-radio-group`)

Look at similar components in the [Vue output target configuration](/core/stencil.config.ts) to see which values they use.

### Vue Tests

- **Inputs**
  - [`Inputs.vue`](/packages/vue/test/base/src/views/Inputs.vue)
  - [`inputs.cy.js`](/packages/vue/test/base/tests/e2e/specs/inputs.cy.js)

These files contain tests for input behavior. Review how similar components are tested and add the new component to the relevant test files.

### React Integration

React components are automatically generated from the core component definitions. No additional configuration is needed.

### React Tests

- **Inputs**
  - [`Inputs.tsx`](/packages/react/test/base/src/pages/Inputs.tsx)
  - [`inputs.cy.ts`](/packages/react/test/base/tests/e2e/specs/components/inputs.cy.ts)

These files contain tests for input behavior. Review how similar components are tested and add the new component to the relevant test files.

### Interface Exports

Add your component's interfaces to the framework packages:

1. Angular ([`packages/angular/src/index.ts`](/packages/angular/src/index.ts)):
```typescript
export {
  NewComponentCustomEvent,
  NewComponentChangeEventDetail,
  NewComponentInputEventDetail,
  // ... other event interfaces
} from '@ionic/core';
```

2. React ([`packages/react/src/components/index.ts`](/packages/react/src/components/index.ts)):
```typescript
export {
  NewComponentCustomEvent,
  NewComponentChangeEventDetail,
  NewComponentInputEventDetail,
  // ... other event interfaces
} from '@ionic/core/components';
```

3. Vue ([`packages/vue/src/index.ts`](/packages/vue/src/index.ts)):
```typescript
export {
  NewComponentCustomEvent,
  NewComponentChangeEventDetail,
  NewComponentInputEventDetail,
  // ... other event interfaces
} from '@ionic/core/components';
```

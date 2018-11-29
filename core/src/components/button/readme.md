# ion-button

Buttons provide a clickable element, which can be used in forms, or anywhere that needs simple, standard button functionality. They may display text, icons, or both. Buttons can be styled with several attributes to look a specific way.

## Expand

This attribute lets you specify how wide the button should be. By default, buttons are inline blocks, but setting this attribute will change the button to a full-width block element.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `block`        | Full-width button with rounded corners.                                      |
| `full`         | Full-width button with square corners and no border on the left or right.    |

## Fill

This attributes determines the background and border color of the button. By default, buttons have a solid background unless the button is inside of a toolbar, in which case it has a transparent background.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `clear`        | Button with a transparent background that resembles a flat button.           |
| `outline`      | Button with a transparent background and a visible border.                   |
| `solid`        | Button with a filled background. Useful for buttons in a toolbar.            |

## Size

This attribute specifies the size of the button. Setting this attribute will change the height and padding of a button.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `small`        | Button with less height and padding. Default for buttons in an item.         |
| `default`      | Button with the default height and padding. Useful for buttons in an item.   |
| `large`        | Button with more height and padding.                                         |


<!-- Auto Generated Below -->


## Usage

### Angular


```html
<!-- Default -->
<ion-button>Default</ion-button>

<!-- Anchor -->
<ion-button href="#">Anchor</ion-button>

<!-- Anchor with backwards transition -->
<ion-button href="/" goBack>Backwards Anchor</ion-button>

<!-- Colors -->
<ion-button color="primary">Primary</ion-button>
<ion-button color="secondary">Secondary</ion-button>
<ion-button color="tertiary">Tertiary</ion-button>
<ion-button color="success">Success</ion-button>
<ion-button color="warning">Warning</ion-button>
<ion-button color="danger">Danger</ion-button>
<ion-button color="light">Light</ion-button>
<ion-button color="medium">Medium</ion-button>
<ion-button color="dark">Dark</ion-button>

<!-- Expand -->
<ion-button expand="full">Full Button</ion-button>
<ion-button expand="block">Block Button</ion-button>

<!-- Round -->
<ion-button shape="round">Round Button</ion-button>

<!-- Fill -->
<ion-button expand="full" fill="outline">Outline + Full</ion-button>
<ion-button expand="block" fill="outline">Outline + Block</ion-button>
<ion-button shape="round" fill="outline">Outline + Round</ion-button>

<!-- Icons -->
<ion-button>
  <ion-icon slot="start" name="star"></ion-icon>
  Left Icon
</ion-button>

<ion-button>
  Right Icon
  <ion-icon slot="end" name="star"></ion-icon>
</ion-button>

<ion-button>
  <ion-icon slot="icon-only" name="star"></ion-icon>
</ion-button>

<!-- Sizes -->
<ion-button size="large">Large</ion-button>
<ion-button>Default</ion-button>
<ion-button size="small">Small</ion-button>
```


### Javascript


```html
<!-- Default -->
<ion-button>Default</ion-button>

<!-- Anchor -->
<ion-button href="#">Anchor</ion-button>

<!-- Anchor with backwards transition -->
<ion-button href="/" go-back>Backwards Anchor</ion-button>

<!-- Colors -->
<ion-button color="primary">Primary</ion-button>
<ion-button color="secondary">Secondary</ion-button>
<ion-button color="tertiary">Tertiary</ion-button>
<ion-button color="success">Success</ion-button>
<ion-button color="warning">Warning</ion-button>
<ion-button color="danger">Danger</ion-button>
<ion-button color="light">Light</ion-button>
<ion-button color="medium">Medium</ion-button>
<ion-button color="dark">Dark</ion-button>

<!-- Expand -->
<ion-button expand="full">Full Button</ion-button>
<ion-button expand="block">Block Button</ion-button>

<!-- Round -->
<ion-button shape="round">Round Button</ion-button>

<!-- Fill -->
<ion-button expand="full" fill="outline">Outline + Full</ion-button>
<ion-button expand="block" fill="outline">Outline + Block</ion-button>
<ion-button shape="round" fill="outline">Outline + Round</ion-button>

<!-- Icons -->
<ion-button>
  <ion-icon slot="start" name="star"></ion-icon>
  Left Icon
</ion-button>

<ion-button>
  Right Icon
  <ion-icon slot="end" name="star"></ion-icon>
</ion-button>

<ion-button>
  <ion-icon slot="icon-only" name="star"></ion-icon>
</ion-button>

<!-- Sizes -->
<ion-button size="large">Large</ion-button>
<ion-button>Default</ion-button>
<ion-button size="small">Small</ion-button>
```



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                            | Type                                                        | Default     |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------- |
| `buttonType`      | `button-type`      | The type of button.                                                                                                                                                                                                                                                    | `string`                                                    | `'button'`  |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                       | `undefined` |
| `disabled`        | `disabled`         | If `true`, the user cannot interact with the button.                                                                                                                                                                                                                   | `boolean`                                                   | `false`     |
| `expand`          | `expand`           | Set to `"block"` for a full-width button or to `"full"` for a full-width button without left and right borders.                                                                                                                                                        | `"block" \| "full" \| undefined`                            | `undefined` |
| `fill`            | `fill`             | Set to `"clear"` for a transparent button, to `"outline"` for a transparent button with a border, or to `"solid"`. The default style is `"solid"` except inside of a toolbar, where the default is `"clear"`.                                                          | `"clear" \| "default" \| "outline" \| "solid" \| undefined` | `undefined` |
| `href`            | `href`             | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.                                                                                                                                                | `string \| undefined`                                       | `undefined` |
| `mode`            | `mode`             | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                             | `undefined` |
| `routerDirection` | `router-direction` | When using a router, it specifies the transition direction when navigating to another page using `href`.                                                                                                                                                               | `"back" \| "forward" \| "root"`                             | `'forward'` |
| `shape`           | `shape`            | The button shape.                                                                                                                                                                                                                                                      | `"round" \| undefined`                                      | `undefined` |
| `size`            | `size`             | The button size.                                                                                                                                                                                                                                                       | `"default" \| "large" \| "small" \| undefined`              | `undefined` |
| `strong`          | `strong`           | If `true`, activates a button with a heavier font weight.                                                                                                                                                                                                              | `boolean`                                                   | `false`     |
| `type`            | `type`             | The type of the button.                                                                                                                                                                                                                                                | `"button" \| "reset" \| "submit"`                           | `'button'`  |


## Events

| Event      | Description                          | Detail |
| ---------- | ------------------------------------ | ------ |
| `ionBlur`  | Emitted when the button loses focus. | void   |
| `ionFocus` | Emitted when the button has focus.   | void   |


## CSS Custom Properties

| Name                     | Description                             |
| ------------------------ | --------------------------------------- |
| `--background`           | Background of the button                |
| `--background-activated` | Background of the button when activated |
| `--background-focused`   | Background of the button when focused   |
| `--border-color`         | Border color of the button              |
| `--border-radius`        | Border radius of the button             |
| `--border-style`         | Border style of the button              |
| `--border-width`         | Border width of the button              |
| `--box-shadow`           | Box shadow of the button                |
| `--color`                | Text color of the button                |
| `--color-activated`      | Text color of the button when activated |
| `--color-focused`        | Text color of the button when focused   |
| `--height`               | Height of the button                    |
| `--margin-bottom`        | Margin bottom of the button             |
| `--margin-end`           | Margin end of the button                |
| `--margin-start`         | Margin start of the button              |
| `--margin-top`           | Margin top of the button                |
| `--opacity`              | Opacity of the button                   |
| `--padding-bottom`       | Padding bottom of the button            |
| `--padding-end`          | Padding end of the button               |
| `--padding-start`        | Padding start of the button             |
| `--padding-top`          | Padding top of the button               |
| `--ripple-color`         | Color of the button ripple effect       |
| `--transition`           | Transition of the button                |
| `--width`                | Width of the button                     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

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


## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                            | Type                                           |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `buttonType`      | `button-type`      | The type of button. Possible values are: `"button"`, `"bar-button"`.                                                                                                                                                                                                   | `string`                                       |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`                                        |
| `disabled`        | `disabled`         | If true, the user cannot interact with the button. Defaults to `false`.                                                                                                                                                                                                | `boolean`                                      |
| `expand`          | `expand`           | Set to `"block"` for a full-width button or to `"full"` for a full-width button without left and right borders.                                                                                                                                                        | `"full"`, `"block"`                            |
| `fill`            | `fill`             | Set to `"clear"` for a transparent button, to `"outline"` for a transparent button with a border, or to `"solid"`. The default style is `"solid"` except inside of a toolbar, where the default is `"clear"`.                                                          | `"clear"`, `"outline"`, `"solid"`, `"default"` |
| `href`            | `href`             | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.                                                                                                                                                | `string`                                       |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`                                         |
| `routerDirection` | `router-direction` | When using a router, it specifies the transition direction when navigating to another page using `href`.                                                                                                                                                               | `RouterDirection`                              |
| `shape`           | `shape`            | The button shape. Possible values are: `"round"`.                                                                                                                                                                                                                      | `"round"`                                      |
| `size`            | `size`             | The button size. Possible values are: `"small"`, `"default"`, `"large"`.                                                                                                                                                                                               | `"small"`, `"default"`, `"large"`              |
| `strong`          | `strong`           | If true, activates a button with a heavier font weight.                                                                                                                                                                                                                | `boolean`                                      |
| `type`            | `type`             | The type of the button. Possible values are: `"submit"`, `"reset"` and `"button"`. Default value is: `"button"`                                                                                                                                                        | `"submit"`, `"reset"`, `"button"`              |


## Events

| Event      | Description                          |
| ---------- | ------------------------------------ |
| `ionBlur`  | Emitted when the button loses focus. |
| `ionFocus` | Emitted when the button has focus.   |


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

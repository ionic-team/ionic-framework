# ion-fab-button

Floating Action Buttons (FABs) represent the primary action in an application. By default, they have a circular shape. When pressed, the button may open more related actions. As the name suggests, FABs generally float over the content in a fixed position. This is not achieved exclusively by using an `<ion-fab-button>FAB</ion-fab-button>`. They need to be wrapped with an `<ion-fab>` component in order to be fixed over the content.

If the FAB button is not wrapped with `<ion-fab>`, it will scroll with the content. FAB buttons have a default size, a mini size and can accept different colors:

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-content>

  <!-- Fixed Floating Action Button that does not scroll with the content -->
  <ion-fab>
    <ion-fab-button>Button</ion-fab-button>
  </ion-fab>

  <!-- Default Floating Action Button that scrolls with the content.-->
  <ion-fab-button>Default</ion-fab-button>

  <!-- Mini -->
  <ion-fab-button mini>Mini</ion-fab-button>

  <!-- Colors -->
  <ion-fab-button color="primary">Primary</ion-fab-button>
  <ion-fab-button color="secondary">Secondary</ion-fab-button>
  <ion-fab-button color="danger">Danger</ion-fab-button>
  <ion-fab-button color="light">Light</ion-fab-button>
  <ion-fab-button color="dark">Dark</ion-fab-button>

</ion-content>
```


### Javascript

```html
<ion-content>

  <!-- Fixed Floating Action Button that does not scroll with the content -->
  <ion-fab>
    <ion-fab-button>Button</ion-fab-button>
  </ion-fab>

  <!-- Default Floating Action Button that scrolls with the content.-->
  <ion-fab-button>Default</ion-fab-button>

  <!-- Mini -->
  <ion-fab-button mini>Mini</ion-fab-button>

  <!-- Colors -->
  <ion-fab-button color="primary">Primary</ion-fab-button>
  <ion-fab-button color="secondary">Secondary</ion-fab-button>
  <ion-fab-button color="danger">Danger</ion-fab-button>
  <ion-fab-button color="light">Light</ion-fab-button>
  <ion-fab-button color="dark">Dark</ion-fab-button>

</ion-content>
```



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                            | Type                              | Default     |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `activated`       | `activated`        | If `true`, the fab button will be show a close icon.                                                                                                                                                                                                                   | `boolean`                         | `false`     |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`             | `undefined` |
| `disabled`        | `disabled`         | If `true`, the user cannot interact with the fab button.                                                                                                                                                                                                               | `boolean`                         | `false`     |
| `href`            | `href`             | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.                                                                                                                                                | `string \| undefined`             | `undefined` |
| `mode`            | `mode`             | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                   | `undefined` |
| `routerDirection` | `router-direction` | When using a router, it specifies the transition direction when navigating to another page using `href`.                                                                                                                                                               | `"back" \| "forward" \| "root"`   | `'forward'` |
| `show`            | `show`             | If `true`, the fab button will show when in a fab-list.                                                                                                                                                                                                                | `boolean`                         | `false`     |
| `translucent`     | `translucent`      | If `true`, the fab button will be translucent.                                                                                                                                                                                                                         | `boolean`                         | `false`     |
| `type`            | `type`             | The type of the button.                                                                                                                                                                                                                                                | `"button" \| "reset" \| "submit"` | `'button'`  |


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
| `--padding-bottom`       | Padding bottom of the button            |
| `--padding-end`          | Padding end of the button               |
| `--padding-start`        | Padding start of the button             |
| `--padding-top`          | Padding top of the button               |
| `--ripple-color`         | Color of the button ripple effect       |
| `--transition`           | Transition of the button                |
| `--width`                | Width of the button                     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

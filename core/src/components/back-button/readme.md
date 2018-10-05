# ion-back-button

The back button navigates back in the app's history upon click. It is smart enough to know what to render based on the mode and when to show based on the navigation stack.

To change what is displayed in the back button, use the `text` and `icon` properties.


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                                                                                                            | Type             |
| ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `color`       | `color`        | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`          |
| `defaultHref` | `default-href` | The url to navigate back to by default when there is no history.                                                                                                                                                                                                       | `string`         |
| `icon`        | `icon`         | The icon name to use for the back button.                                                                                                                                                                                                                              | `string`, `null` |
| `mode`        | `mode`         | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`           |
| `text`        | `text`         | The text to display in the back button.                                                                                                                                                                                                                                | `string`, `null` |


## CSS Custom Properties

| Name                    | Description                       |
| ----------------------- | --------------------------------- |
| `--background`          | Background of the button          |
| `--border-radius`       | Border radius of the button       |
| `--color`               | Text color of the button          |
| `--icon-font-size`      | Font size of the button icon      |
| `--icon-font-weight`    | Font weight of the button icon    |
| `--icon-margin-bottom`  | Margin bottom of the button icon  |
| `--icon-margin-end`     | Margin end of the button icon     |
| `--icon-margin-start`   | Margin start of the button icon   |
| `--icon-margin-top`     | Margin top of the button icon     |
| `--icon-padding-bottom` | Padding bottom of the button icon |
| `--icon-padding-end`    | Padding end of the button icon    |
| `--icon-padding-start`  | Padding start of the button icon  |
| `--icon-padding-top`    | Padding top of the button icon    |
| `--margin-bottom`       | Margin bottom of the button       |
| `--margin-end`          | Margin end of the button          |
| `--margin-start`        | Margin start of the button        |
| `--margin-top`          | Margin top of the button          |
| `--min-height`          | Minimum height of the button      |
| `--min-width`           | Minimum width of the button       |
| `--opacity`             | Opacity of the button             |
| `--padding-bottom`      | Padding bottom of the button      |
| `--padding-end`         | Padding end of the button         |
| `--padding-start`       | Padding start of the button       |
| `--padding-top`         | Padding top of the button         |
| `--ripple-color`        | Color of the button ripple effect |
| `--transition`          | Transition of the button          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

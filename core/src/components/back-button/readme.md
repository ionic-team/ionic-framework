# ion-back-button

The back button navigates back in the app's history upon click. It is smart enough to know what to render based on the mode and when to show based on the navigation stack.

To change what is displayed in the back button, use the `text` and `icon` properties.


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                                                                                                            | Type     |
| ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `color`       | `color`        | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`  |
| `defaultHref` | `default-href` | The url to navigate back to by default when there is no history.                                                                                                                                                                                                       | `string` |
| `icon`        | `icon`         | The icon name to use for the back button.                                                                                                                                                                                                                              | `string` |
| `mode`        | `mode`         | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`   |
| `text`        | `text`         | The text to display in the back button.                                                                                                                                                                                                                                | `string` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# ion-item-option

The option button for an `ion-item-sliding`. Must be placed inside of an `<ion-item-options>`.
You can combine the `ionSwipe` event and the `expandable` directive to create a full swipe
action for the item.

<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `color`      | `color`      | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `disabled`   | `disabled`   | If `true`, the user cannot interact with the item option.                                                                                                                                                                                                              | `boolean`             | `false`     |
| `expandable` | `expandable` | If `true`, the option will expand to take up the available width and cover any other options.                                                                                                                                                                          | `boolean`             | `false`     |
| `href`       | `href`       | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.                                                                                                                                                | `string \| undefined` | `undefined` |
| `mode`       | `mode`       | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## Slots

| Slot          | Description                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------- |
|               | The default slot should contain the option text                                             |
| `"bottom"`    | Will show the icon below the text                                                           |
| `"end"`       | Content will be placed to the right edge of the option in LTR, and to the left edge in RTL. |
| `"icon-only"` | Use this if the option only contains an icon                                                |
| `"start"`     | Content will be placed to the left edge of the option in LTR, and to the right edge in RTL. |
| `"top"`       | Will show the icon above the text                                                           |


## CSS Custom Properties

| Name           | Description                   |
| -------------- | ----------------------------- |
| `--background` | Background of the item option |
| `--color`      | Color of the item option      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

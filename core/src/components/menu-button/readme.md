# ion-menu-button

Menu Button is component that automatically creates the icon and functionality to open a menu on a page.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description                                                                                                                                                                                                                                                            | Type                  | Default     |
| ---------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `autoHide` | `auto-hide` | Automatically hides the menu button when the corresponding menu is not active                                                                                                                                                                                          | `boolean`             | `true`      |
| `color`    | `color`     | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined` | `undefined` |
| `menu`     | `menu`      | Optional property that maps to a Menu's `menuId` prop. Can also be `start` or `end` for the menu side. This is used to find the correct menu to toggle                                                                                                                 | `string \| undefined` | `undefined` |
| `mode`     | `mode`      | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`       | `undefined` |


## CSS Custom Properties

| Name               | Description                  |
| ------------------ | ---------------------------- |
| `--color`          | Color of the menu button     |
| `--padding-bottom` | Padding bottom of the button |
| `--padding-end`    | Padding end of the button    |
| `--padding-start`  | Padding start of the button  |
| `--padding-top`    | Padding top of the button    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

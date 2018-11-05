# ion-tab-bar

Tab bar is a UI component that hold the array of [tab buttons](../tab-button). The Tab bar can provide a global setting for different tab/icon layouts as well as different positions for the bar itself.

See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.


<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                                                                                                    | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------- |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                                   | `undefined` |
| `disabled` | `disabled` | The selected tab component                                                                                                                                                                                                                                             | `boolean`                                                                                               | `false`     |
| `href`     | `href`     | The URL which will be used as the `href` within this tab's button anchor.                                                                                                                                                                                              | `string \| undefined`                                                                                   | `undefined` |
| `layout`   | `layout`   | Set the layout of the text and icon in the tab bar. It defaults to `'icon-top'`.                                                                                                                                                                                       | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide" \| undefined` | `undefined` |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                                                                         | `undefined` |
| `tab`      | `tab`      | A tab id must be provided for each `ion-tab`. It's used internally to reference the selected tab or by the router to switch between them.                                                                                                                              | `string`                                                                                                | `undefined` |


## CSS Custom Properties

| Name                    | Description                           |
| ----------------------- | ------------------------------------- |
| `--background`          | Background of the tab button          |
| `--background-selected` | Background of the selected tab button |
| `--color`               | Color of the tab button               |
| `--color-selected`      | Color of the selected tab button      |
| `--padding-bottom`      | Bottom padding of the tab button      |
| `--padding-end`         | End padding of the tab button         |
| `--padding-start`       | Start padding of the tab button       |
| `--padding-top`         | Top padding of the tab button         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

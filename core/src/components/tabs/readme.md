# ion-tabs

Tabs are a top level navigation component for created multiple stacked navs.
The component is a container of individual [Tab](../Tab/) components.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                            | Type              |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `Color`           |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                                                                                                                                                                              | `Mode`            |
| `name`            | `name`             | A unique name for the tabs.                                                                                                                                                                                                                                            | `string`          |
| `tabbarHidden`    | `tabbar-hidden`    | If true, the tabbar will be hidden. Defaults to `false`.                                                                                                                                                                                                               | `boolean`         |
| `tabbarHighlight` | `tabbar-highlight` | If true, show the tab highlight bar under the selected tab.                                                                                                                                                                                                            | `boolean`         |
| `tabbarLayout`    | `tabbar-layout`    | Set the layout of the text and icon in the tabbar. Available options: `"icon-top"`, `"icon-start"`, `"icon-end"`, `"icon-bottom"`, `"icon-hide"`, `"label-hide"`.                                                                                                      | `TabbarLayout`    |
| `tabbarPlacement` | `tabbar-placement` | Set the position of the tabbar, relative to the content. Available options: `"top"`, `"bottom"`.                                                                                                                                                                       | `TabbarPlacement` |
| `translucent`     | `translucent`      | If true, the tabs will be translucent. Note: In order to scroll content behind the tabs, the `fullscreen` attribute needs to be set on the content. Defaults to `false`.                                                                                               | `boolean`         |
| `useRouter`       | `use-router`       | If true, the tabs will use the router and `selectedTab` will not do anything.                                                                                                                                                                                          | `boolean`         |


## Events

| Event              | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `ionChange`        | Emitted when the tab changes.                                              |
| `ionNavDidChange`  | Emitted when the navigation has finished transitioning to a new component. |
| `ionNavWillChange` | Emitted when the navigation is about to transition to a new component.     |
| `ionNavWillLoad`   | Emitted when the navigation will load a component.                         |


## Methods

| Method        | Description                                      |
| ------------- | ------------------------------------------------ |
| `getRouteId`  |                                                  |
| `getSelected` | Get the currently selected tab                   |
| `getTab`      | Get the tab at the given index                   |
| `select`      | Index or the Tab instance, of the tab to select. |
| `setRouteId`  |                                                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

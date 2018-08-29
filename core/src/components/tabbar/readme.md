# ion-tabbar

Tabbar is an internal component for Tabs. Please see the [Tabs documentation](../tabs).


<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                                                                                                                                       | Type                  |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `color`       | `color`       |                                                                                                                                                                   | `Color`               |
| `highlight`   | `highlight`   | If true, show the tab highlight bar under the selected tab.                                                                                                       | `boolean`             |
| `layout`      | `layout`      | Set the layout of the text and icon in the tabbar. Available options: `"icon-top"`, `"icon-start"`, `"icon-end"`, `"icon-bottom"`, `"icon-hide"`, `"label-hide"`. | `TabbarLayout`        |
| `mode`        | `mode`        |                                                                                                                                                                   | `Mode`                |
| `placement`   | `placement`   | Set the position of the tabbar, relative to the content. Available options: `"top"`, `"bottom"`.                                                                  | `TabbarPlacement`     |
| `selectedTab` | --            | The selected tab component                                                                                                                                        | `HTMLIonTabElement`   |
| `tabs`        | --            | The tabs to render                                                                                                                                                | `HTMLIonTabElement[]` |
| `translucent` | `translucent` | If true, the tabbar will be translucent. Defaults to `false`.                                                                                                     | `boolean`             |


## Events

| Event            | Description                         |
| ---------------- | ----------------------------------- |
| `ionTabbarClick` | Emitted when the tab bar is clicked |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# ion-tab

The Tab component is a child component of the [Tabs](../Tabs/) component.
Each Tab is meant to be a top level navigation stack for an app.
Meaning that an app can have many tabs, all wit their own independent navigation.

See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.


<!-- Auto Generated Below -->


## Properties

| Property             | Attribute                | Description                                                               | Type                |
| -------------------- | ------------------------ | ------------------------------------------------------------------------- | ------------------- |
| `active`             | `active`                 | If true, sets the tab as the active tab.                                  | `boolean`           |
| `badgeColor`         | `badge-color`            | The badge color for the tab button.                                       | `Color`             |
| `badge`              | `badge`                  | The badge for the tab.                                                    | `string`            |
| `btnId`              | `btn-id`                 | hidden                                                                    | `string`            |
| `component`          | `component`              | The component to display inside of the tab.                               | `ComponentRef`      |
| `delegate`           | --                       | hidden                                                                    | `FrameworkDelegate` |
| `disabled`           | `disabled`               | If true, the user cannot interact with the tab. Defaults to `false`.      | `boolean`           |
| `href`               | `href`                   | The URL which will be used as the `href` within this tab's button anchor. | `string`            |
| `icon`               | `icon`                   | The icon for the tab.                                                     | `string`            |
| `label`              | `label`                  | The label of the tab.                                                     | `string`            |
| `name`               | `name`                   | The name of the tab.                                                      | `string`            |
| `selected`           | `selected`               | If true, the tab will be selected. Defaults to `false`.                   | `boolean`           |
| `show`               | `show`                   | If true, the tab button is visible within the tabbar. Defaults to `true`. | `boolean`           |
| `tabsHideOnSubPages` | `tabs-hide-on-sub-pages` | If true, hide the tabs on child pages.                                    | `boolean`           |


## Events

| Event           | Description                                          |
| --------------- | ---------------------------------------------------- |
| `ionSelect`     | Emitted when the current tab is selected.            |
| `ionTabMutated` | Emitted when the tab props mutates. Used internally. |


## Methods

| Method      | Description                          |
| ----------- | ------------------------------------ |
| `setActive` | Set the active component for the tab |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

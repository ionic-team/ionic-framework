# ion-tabs

Tabs are a top level navigation component for created multiple stacked navs.
The component is a container of individual [Tab](../Tab/) components.

`ion-tabs` is a styleless component that works as a router outlet in
order to handle navigation. When the user does not provide a `ion-tab-bar` in their markup, `ion-tabs`, by default provides one. Notice that `ion-tab-bar` is the UI component that can be used to switch between tabs.

In order to customize the style of the `ion-tab-bar`, it should be included in the user's markup as
direct children of `ion-tabs`, like this:

```html
<ion-tabs>
  <ion-tab tab="home">Content</ion-tab>
  <ion-tab tab="settings">Content 3</ion-tab>

  <ion-tab-bar>

    <ion-tab-button tab="home">
      <ion-label>Home</ion-label>
      <ion-icon name="home"></ion-label>
    </ion-tab-button>

    <ion-tab-button tab="settings">
      <ion-label>Settings</ion-label>
      <ion-icon name="gears"></ion-label>
    </ion-tab-button>

  </ion-tab-bar>
</ion-tabs>
```

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                 | Type                  |
| -------- | --------- | --------------------------- | --------------------- |
| `name`   | `name`    | A unique name for the tabs. | `string \| undefined` |


## Events

| Event              | Detail                   | Description                                                                |
| ------------------ | ------------------------ | -------------------------------------------------------------------------- |
| `ionChange`        | {tab: HTMLIonTabElement} | Emitted when the tab changes.                                              |
| `ionNavDidChange`  |                          | Emitted when the navigation has finished transitioning to a new component. |
| `ionNavWillChange` |                          | Emitted when the navigation is about to transition to a new component.     |
| `ionNavWillLoad`   |                          | Emitted when the navigation will load a component.                         |


## Methods

### `getRouteId() => Promise<RouteID | undefined>`



#### Returns

Type: `Promise<RouteID | undefined>`



### `getSelected() => Promise<HTMLIonTabElement | undefined>`

Get the currently selected tab

#### Returns

Type: `Promise<HTMLIonTabElement | undefined>`



### `getTab(tabOrIndex: string | HTMLIonTabElement) => Promise<HTMLIonTabElement | undefined>`

Get the tab at the given index

#### Parameters

| Name         | Type                          | Description |
| ------------ | ----------------------------- | ----------- |
| `tabOrIndex` | `HTMLIonTabElement \| string` |             |

#### Returns

Type: `Promise<HTMLIonTabElement | undefined>`



### `select(tabOrId: string | HTMLIonTabElement) => Promise<boolean>`

Index or the Tab instance, of the tab to select.

#### Parameters

| Name      | Type                          | Description |
| --------- | ----------------------------- | ----------- |
| `tabOrId` | `HTMLIonTabElement \| string` |             |

#### Returns

Type: `Promise<boolean>`



### `setRouteId(id: string) => Promise<RouteWrite>`



#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` |             |

#### Returns

Type: `Promise<RouteWrite>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

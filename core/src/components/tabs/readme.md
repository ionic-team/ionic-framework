# ion-tabs

Tabs are a top level navigation component to implement a tab-based navigation.
The component is a container of individual [Tab](../Tab/) components.

`ion-tabs` is a styleless component that works as a router outlet in order to handle navigation.
This component does not provide any UI feedback or mechanism to switch between tabs.
In order to do so, an `ion-tab-bar` should be provided as a direct child of `ion-tabs`:

```html
<ion-tabs>
  <ion-tab tab="home">Home Content</ion-tab>
  <ion-tab tab="settings">Settings Content</ion-tab>

  <ion-tab-bar slot="bottom">

    <ion-tab-button tab="home">
      <ion-label>Home</ion-label>
      <ion-icon name="home"></ion-icon>
      <ion-badge>6</ion-badge>
    </ion-tab-button>

    <ion-tab-button tab="settings">
      <ion-label>Settings</ion-label>
      <ion-icon name="gear"></ion-icon>
    </ion-tab-button>

  </ion-tab-bar>
</ion-tabs>
```

Note that both `ion-tabs` and `ion-tab-bar` can be used as standalone elements. They don’t depend on each other to work, but they are usually used together in order to implement a tab-based navigation that feels like a native app.

`ion-tab-bar` always needs `slot="bottom"` in order to be projected into `ion-tabs` at the right place.

## The "tab" property

Each `ion-tab-button` will activate one of the tabs when tapped.
In order to link the button to the `ion-tab` container, a matching `tab` property must be used.

```html
<ion-tab tab="settings">
[...]
<ion-tab-button tab="settings">
```

This `ion-tab-button` and `ion-tab` are now linked by the common `tab` property.

The `tab` property identifies each tab, and it has to be unique within the scope of the same `ion-tabs`. It's important to set the same property to `ion-tab` and `ion-tab-button`, even if you are only using one. e.g. You could use the `ion-tab-bar` without using `ion-tabs`. In this case you should still give each `ion-tab` the property of `tab="something"`.

### Router integration

When the ionic's router (`ion-router`) is used, the `tab` property matches the "component" of `ion-route`:

The following route within the scope of a `ion-tabs` outlet:

```html
<ion-route path="/settings-page" component="settings"></ion-route>
```

Would match the following tab:

```html
<ion-tab tab="settings" component="settings-component"></ion-tab>
```

### Angular Router integration

Using tabs with Angular's router is fairly straight forward. The only additional requirement is that an href is supplied to update the browser URL. In this way, the correct `ion-tab` is selected, and the URl is updated.

```html

<ion-tabs>
  <ion-tab-bar slot="bottom">
    <ion-tab-button tab="schedule" href="/app/tabs/(schedule:schedule)">
      <ion-icon name="calendar"></ion-icon>
      <ion-label>Schedule</ion-label>
    </ion-tab-button>
  </ion-tab-bar>

  <ion-tab tab="schedule">
    <ion-router-outlet name="schedule"></ion-router-outlet>
  </ion-tab>
</ion-tabs>
```

<!-- Auto Generated Below -->


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



### `getTab(tab: string | HTMLIonTabElement) => Promise<HTMLIonTabElement | undefined>`

Get the tab at the given index

#### Parameters

| Name  | Type                          | Description |
| ----- | ----------------------------- | ----------- |
| `tab` | `HTMLIonTabElement \| string` |             |

#### Returns

Type: `Promise<HTMLIonTabElement | undefined>`



### `select(tab: string | HTMLIonTabElement) => Promise<boolean>`

Index or the Tab instance, of the tab to select.

#### Parameters

| Name  | Type                          | Description |
| ----- | ----------------------------- | ----------- |
| `tab` | `HTMLIonTabElement \| string` |             |

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

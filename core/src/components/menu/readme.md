# ion-menu

The Menu component is a navigation drawer that slides in from the side of the current view.
By default, it slides in from the left, but the side can be overridden.
The menu will be displayed differently based on the mode, however the display type can be changed to any of the available menu types.
The menu element should be a sibling to the root content element.
There can be any number of menus attached to the content.
These can be controlled from the templates, or programmatically using the MenuController.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-menu>
  <ion-header>
    <ion-toolbar>
      <ion-title>Menu</ion-title>
    </ion-toolbar>
  </ion-header>
</ion-menu>
<ion-router-outlet main></ion-router-outlet>
```


### Javascript

```html
<ion-app>
  <ion-menu side="start">
    <ion-header>
      <ion-toolbar color="secondary">
        <ion-title>Left Menu</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-menu>

  <ion-menu side="end">
    <ion-header>
      <ion-toolbar>
        <ion-title>Hola</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      hola macho
    </ion-content>
  </ion-menu>

  <div class="ion-page" main>
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu - Basic</ion-title>
      </ion-toolbar>
    </ion-header>
  </div>

</ion-app>
<ion-menu-controller></ion-menu-controller>
```



## Properties

| Property       | Attribute        | Description                                                                                                        | Type                  | Default     |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------- | ----------- |
| `contentId`    | `content-id`     | The content's id the menu should use.                                                                              | `string \| undefined` | `undefined` |
| `disabled`     | `disabled`       | If `true`, the menu is disabled.                                                                                   | `boolean`             | `false`     |
| `maxEdgeStart` | `max-edge-start` | The edge threshold for dragging the menu open. If a drag/swipe happens over this value, the menu is not triggered. | `number`              | `50`        |
| `menuId`       | `menu-id`        | An id for the menu.                                                                                                | `string \| undefined` | `undefined` |
| `side`         | `side`           | Which side of the view the menu should be placed.                                                                  | `"end" \| "start"`    | `'start'`   |
| `swipeGesture` | `swipe-gesture`  | If `true`, swiping the menu is enabled.                                                                            | `boolean`             | `true`      |
| `type`         | `type`           | The display type of the menu. Available options: `"overlay"`, `"reveal"`, `"push"`.                                | `string \| undefined` | `undefined` |


## Events

| Event          | Description                                  | Detail |
| -------------- | -------------------------------------------- | ------ |
| `ionDidClose`  | Emitted when the menu is closed.             | void   |
| `ionDidOpen`   | Emitted when the menu is open.               | void   |
| `ionWillClose` | Emitted when the menu is about to be closed. | void   |
| `ionWillOpen`  | Emitted when the menu is about to be opened. | void   |


## Methods

### `close(animated?: boolean) => Promise<boolean>`

Closes the menu. If the menu is already closed or it can't be closed,
it returns `false`.

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| `animated` | `boolean` |             |

#### Returns

Type: `Promise<boolean>`



### `isActive() => Promise<boolean>`

Returns `true` is the menu is active.

A menu is active when it can be opened or closed, meaning it's enabled
and it's not part of a `ion-split-pane`.

#### Returns

Type: `Promise<boolean>`



### `isOpen() => Promise<boolean>`

Returns `true` is the menu is open.

#### Returns

Type: `Promise<boolean>`



### `open(animated?: boolean) => Promise<boolean>`

Opens the menu. If the menu is already open or it can't be opened,
it returns `false`.

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| `animated` | `boolean` |             |

#### Returns

Type: `Promise<boolean>`



### `setOpen(shouldOpen: boolean, animated?: boolean) => Promise<boolean>`

Opens or closes the button.
If the operation can't be completed successfully, it returns `false`.

#### Parameters

| Name         | Type      | Description |
| ------------ | --------- | ----------- |
| `shouldOpen` | `boolean` |             |
| `animated`   | `boolean` |             |

#### Returns

Type: `Promise<boolean>`



### `toggle(animated?: boolean) => Promise<boolean>`

Toggles the menu. If the menu is already open, it will try to close, otherwise it will try to open it.
If the operation can't be completed successfully, it returns `false`.

#### Parameters

| Name       | Type      | Description |
| ---------- | --------- | ----------- |
| `animated` | `boolean` |             |

#### Returns

Type: `Promise<boolean>`




## CSS Custom Properties

| Name            | Description             |
| --------------- | ----------------------- |
| `--background`  | Background of the menu  |
| `--width`       | Width of the menu       |
| `--width-small` | Width of the small menu |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

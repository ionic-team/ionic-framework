# ion-menu

The Menu component is a navigation drawer that slides in from the side of the current view.
By default, it slides in from the left, but the side can be overridden.
The menu will be displayed differently based on the mode, however the display type can be changed to any of the available menu types.
The menu element should be a sibling to the root content element.
There can be any number of menus attached to the content.
These can be controlled from the templates, or programmatically using the MenuController.


<!-- Auto Generated Below -->


## Properties

| Property       | Attribute        | Description                                                                                                        | Type                  |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `contentId`    | `content-id`     | The content's id the menu should use.                                                                              | `string \| undefined` |
| `disabled`     | `disabled`       | If `true`, the menu is disabled.                                                                                   | `boolean`             |
| `maxEdgeStart` | `max-edge-start` | The edge threshold for dragging the menu open. If a drag/swipe happens over this value, the menu is not triggered. | `number`              |
| `menuId`       | `menu-id`        | An id for the menu.                                                                                                | `string \| undefined` |
| `side`         | `side`           | Which side of the view the menu should be placed.                                                                  | `"end" \| "start"`    |
| `swipeGesture` | `swipe-gesture`  | If `true`, swiping the menu is enabled.                                                                            | `boolean`             |
| `type`         | `type`           | The display type of the menu. Available options: `"overlay"`, `"reveal"`, `"push"`.                                | `string \| undefined` |


## Events

| Event          | Detail | Description                                  |
| -------------- | ------ | -------------------------------------------- |
| `ionDidClose`  |        | Emitted when the menu is closed.             |
| `ionDidOpen`   |        | Emitted when the menu is open.               |
| `ionWillClose` |        | Emitted when the menu is about to be closed. |
| `ionWillOpen`  |        | Emitted when the menu is about to be opened. |


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

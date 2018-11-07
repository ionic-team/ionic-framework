# ion-picker

A Picker is a dialog that displays a row of buttons and columns underneath. It appears on top of the app's content, and at the bottom of the viewport.



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                              |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `animated`        | `animated`         | If `true`, the picker will animate.                                                                              | `boolean`                         |
| `backdropDismiss` | `backdrop-dismiss` | If `true`, the picker will be dismissed when the backdrop is clicked.                                            | `boolean`                         |
| `buttons`         | --                 | Array of buttons to be displayed at the top of the picker.                                                       | `PickerButton[]`                  |
| `columns`         | --                 | Array of columns to be displayed in the picker.                                                                  | `PickerColumn[]`                  |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[] \| undefined` |
| `duration`        | `duration`         | Number of milliseconds to wait before dismissing the picker.                                                     | `number`                          |
| `enterAnimation`  | --                 | Animation to use when the picker is presented.                                                                   | `AnimationBuilder \| undefined`   |
| `keyboardClose`   | `keyboard-close`   | If `true`, the keyboard will be automatically dismissed when the overlay is presented.                           | `boolean`                         |
| `leaveAnimation`  | --                 | Animation to use when the picker is dismissed.                                                                   | `AnimationBuilder \| undefined`   |
| `mode`            | `mode`             | The mode determines which platform styles to use.                                                                | `"ios" \| "md"`                   |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`                          |
| `showBackdrop`    | `show-backdrop`    | If `true`, a backdrop will be displayed behind the picker.                                                       | `boolean`                         |


## Events

| Event                  | Detail             | Description                              |
| ---------------------- | ------------------ | ---------------------------------------- |
| `ionPickerDidDismiss`  | OverlayEventDetail | Emitted after the picker has dismissed.  |
| `ionPickerDidLoad`     |                    | Emitted after the picker has loaded.     |
| `ionPickerDidPresent`  |                    | Emitted after the picker has presented.  |
| `ionPickerDidUnload`   |                    | Emitted after the picker has unloaded.   |
| `ionPickerWillDismiss` | OverlayEventDetail | Emitted before the picker has dismissed. |
| `ionPickerWillPresent` |                    | Emitted before the picker has presented. |


## Methods

### `dismiss(data?: any, role?: string | undefined) => Promise<boolean>`

Dismiss the picker overlay after it has been presented.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getColumn(name: string) => Promise<PickerColumn | undefined>`

Returns the column the matches the specified name

#### Parameters

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `name` | `string` |             |

#### Returns

Type: `Promise<PickerColumn | undefined>`



### `onDidDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the picker did dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `onWillDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the picker will dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `present() => Promise<void>`

Present the picker overlay after it has been created.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

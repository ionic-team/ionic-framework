# ion-picker

A Picker is a dialog that displays a row of buttons and columns underneath. It appears on top of the app's content, and at the bottom of the viewport.



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                 |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------- |
| `animated`        | `animated`         | If true, the picker will animate. Defaults to `true`.                                                            | `boolean`            |
| `backdropDismiss` | `backdrop-dismiss` | If true, the picker will be dismissed when the backdrop is clicked. Defaults to `true`.                          | `boolean`            |
| `buttons`         | --                 | Array of buttons to be displayed at the top of the picker.                                                       | `PickerButton[]`     |
| `columns`         | --                 | Array of columns to be displayed in the picker.                                                                  | `PickerColumn[]`     |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string`, `string[]` |
| `duration`        | `duration`         | Number of milliseconds to wait before dismissing the picker.                                                     | `number`             |
| `enterAnimation`  | --                 | Animation to use when the picker is presented.                                                                   | `AnimationBuilder`   |
| `keyboardClose`   | `keyboard-close`   | If true, the keyboard will be automatically dismissed when the overlay is presented.                             | `boolean`            |
| `leaveAnimation`  | --                 | Animation to use when the picker is dismissed.                                                                   | `AnimationBuilder`   |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                        | `Mode`               |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`             |
| `showBackdrop`    | `show-backdrop`    | If true, a backdrop will be displayed behind the picker. Defaults to `true`.                                     | `boolean`            |


## Events

| Event                  | Description                              |
| ---------------------- | ---------------------------------------- |
| `ionPickerDidDismiss`  | Emitted after the picker has dismissed.  |
| `ionPickerDidLoad`     | Emitted after the picker has loaded.     |
| `ionPickerDidPresent`  | Emitted after the picker has presented.  |
| `ionPickerDidUnload`   | Emitted after the picker has unloaded.   |
| `ionPickerWillDismiss` | Emitted before the picker has dismissed. |
| `ionPickerWillPresent` | Emitted before the picker has presented. |


## Methods

| Method          | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| `dismiss`       | Dismiss the picker overlay after it has been presented.       |
| `getColumn`     | Returns the column the matches the specified name             |
| `onDidDismiss`  | Returns a promise that resolves when the picker did dismiss.  |
| `onWillDismiss` | Returns a promise that resolves when the picker will dismiss. |
| `present`       | Present the picker overlay after it has been created.         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

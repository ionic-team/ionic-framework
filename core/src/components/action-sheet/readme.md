# ion-action-sheet

An Action Sheet is a dialog that displays a set of options. It appears on top of the app's content, and must be manually dismissed by the user before they can resume interaction with the app. Destructive options are made obvious in `ios` mode. There are multiple ways to dismiss the action sheet, including tapping the backdrop or hitting the escape key on desktop.

### Creating

An action sheet can be created by the [Action Sheet Controller](../../action-sheet-controller/ActionSheetController) from an array of `buttons`, with each button including properties for its `text`, and optionally a `handler` and `role`. If a handler returns `false` then the action sheet will not be dismissed. An action sheet can also optionally have a `title`, `subTitle` and an `icon`.

### Buttons

A button's `role` property can either be `destructive` or `cancel`. Buttons without a role property will have the default look for the platform. Buttons with the `cancel` role will always load as the bottom button, no matter where they are in the array. All other buttons will be displayed in the order they have been added to the `buttons` array. Note: We recommend that `destructive` buttons are always the first button in the array, making them the top button. Additionally, if the action sheet is dismissed by tapping the backdrop, then it will fire the handler from the button with the cancel role.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                             |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `animated`        | `animated`         | If true, the action sheet will animate. Defaults to `true`.                                                      | `boolean`                        |
| `backdropDismiss` | `backdrop-dismiss` | If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.                    | `boolean`                        |
| `buttons`         | --                 | An array of buttons for the action sheet.                                                                        | `(ActionSheetButton | string)[]` |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string`, `string[]`             |
| `enterAnimation`  | --                 | Animation to use when the action sheet is presented.                                                             | `AnimationBuilder`               |
| `header`          | `header`           | Title for the action sheet.                                                                                      | `string`                         |
| `keyboardClose`   | `keyboard-close`   | If true, the keyboard will be automatically dismissed when the overlay is presented.                             | `boolean`                        |
| `leaveAnimation`  | --                 | Animation to use when the action sheet is dismissed.                                                             | `AnimationBuilder`               |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                        | `Mode`                           |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`                         |
| `subHeader`       | `sub-header`       | Subtitle for the action sheet.                                                                                   | `string`                         |
| `translucent`     | `translucent`      | If true, the action sheet will be translucent. Defaults to `false`.                                              | `boolean`                        |


## Events

| Event                       | Description                             |
| --------------------------- | --------------------------------------- |
| `ionActionSheetDidDismiss`  | Emitted after the alert has dismissed.  |
| `ionActionSheetDidLoad`     | Emitted after the alert has loaded.     |
| `ionActionSheetDidPresent`  | Emitted after the alert has presented.  |
| `ionActionSheetDidUnload`   | Emitted after the alert has unloaded.   |
| `ionActionSheetWillDismiss` | Emitted before the alert has dismissed. |
| `ionActionSheetWillPresent` | Emitted before the alert has presented. |


## Methods

| Method          | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `dismiss`       | Dismiss the action sheet overlay after it has been presented.       |
| `onDidDismiss`  | Returns a promise that resolves when the action-sheet did dismiss.  |
| `onWillDismiss` | Returns a promise that resolves when the action-sheet will dismiss. |
| `present`       | Present the action sheet overlay after it has been created.         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

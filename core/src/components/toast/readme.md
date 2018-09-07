# ion-toast

A Toast is a subtle notification commonly used in modern applications. It can be used to provide feedback about an operation or to display a system message. The toast appears on top of the app's content, and can be dismissed by the app to resume user interaction with the app.

### Creating

All of the toast options should be passed in the create method. The message to display should be passed in the `message` property. The `showCloseButton` option can be set to true in order to display a close button on the toast. See the properties below for all available options.

### Positioning

Toasts can be positioned at the top, bottom or middle of the viewport. The position can be passed upon creation. The possible values are `top`, `bottom` and `middle`. If the position is not specified, the toast will be displayed at the bottom of the viewport.

### Dismissing

The toast can be dismissed automatically after a specific amount of time by passing the number of milliseconds to display it in the `duration` of the toast options. If `showCloseButton` is set to true, then the close button will dismiss the toast. To dismiss the toast after creation, call the `dismiss()` method on the instance.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                      | Type                            |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `animated`        | `animated`          | If true, the toast will animate. Defaults to `true`.                                                             | `boolean`                       |
| `closeButtonText` | `close-button-text` | Text to display in the close button.                                                                             | `string`                        |
| `cssClass`        | `css-class`         | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string`, `string[]`            |
| `duration`        | `duration`          | How many milliseconds to wait before hiding the toast. By default, it will show until `dismiss()` is called.     | `number`                        |
| `enterAnimation`  | --                  | Animation to use when the toast is presented.                                                                    | `AnimationBuilder`              |
| `keyboardClose`   | `keyboard-close`    | If true, the keyboard will be automatically dismissed when the overlay is presented.                             | `boolean`                       |
| `leaveAnimation`  | --                  | Animation to use when the toast is dismissed.                                                                    | `AnimationBuilder`              |
| `message`         | `message`           | Message to be shown in the toast.                                                                                | `string`                        |
| `mode`            | `mode`              | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                        | `Mode`                          |
| `overlayIndex`    | `overlay-index`     |                                                                                                                  | `number`                        |
| `position`        | `position`          | The position of the toast on the screen. Possible values: "top", "middle", "bottom".                             | `"top"`, `"bottom"`, `"middle"` |
| `showCloseButton` | `show-close-button` | If true, the close button will be displayed. Defaults to `false`.                                                | `boolean`                       |
| `translucent`     | `translucent`       | If true, the toast will be translucent. Defaults to `false`.                                                     | `boolean`                       |


## Events

| Event                 | Description                             |
| --------------------- | --------------------------------------- |
| `ionToastDidDismiss`  | Emitted after the toast has dismissed.  |
| `ionToastDidLoad`     | Emitted after the toast has loaded.     |
| `ionToastDidPresent`  | Emitted after the toast has presented.  |
| `ionToastDidUnload`   | Emitted after the toast has unloaded.   |
| `ionToastWillDismiss` | Emitted before the toast has dismissed. |
| `ionToastWillPresent` | Emitted before the toast has presented. |


## Methods

| Method          | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `dismiss`       | Dismiss the toast overlay after it has been presented.       |
| `onDidDismiss`  | Returns a promise that resolves when the toast did dismiss.  |
| `onWillDismiss` | Returns a promise that resolves when the toast will dismiss. |
| `present`       | Present the toast overlay after it has been created.         |


## CSS Custom Properties

| Name             | Description              |
| ---------------- | ------------------------ |
| `--background`   | Background of the toast  |
| `--button-color` | Color of the button text |
| `--color`        | Color of the toast text  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

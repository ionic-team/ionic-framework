# ion-alert

An Alert is a dialog that presents users with information or collects information from the user using inputs. An alert appears on top of the app's content, and must be manually dismissed by the user before they can resume interaction with the app. It can also optionally have a `header`, `subHeader` and `message`.


### Creating

Alerts can be created using a [Alert Controller](../../alert-controller/AlertController). They can be customized by passing alert options in the alert controller's create method.


### Buttons

In the array of `buttons`, each button includes properties for its `text`, and optionally a `handler`. If a handler returns `false` then the alert will not automatically be dismissed when the button is clicked. All buttons will show up in the order they have been added to the `buttons` array from left to right. Note: The right most button (the last one in the array) is the main button.

Optionally, a `role` property can be added to a button, such as `cancel`. If a `cancel` role is on one of the buttons, then if the alert is dismissed by tapping the backdrop, then it will fire the handler from the button with a cancel role.


### Inputs

Alerts can also include several different inputs whose data can be passed back to the app. Inputs can be used as a simple way to prompt users for information. Radios, checkboxes and text inputs are all accepted, but they cannot be mixed. For example, an alert could have all radio button inputs, or all checkbox inputs, but the same alert cannot mix radio and checkbox inputs. Do note however, different types of "text" inputs can be mixed, such as `url`, `email`, `text`, etc. If you require a complex form UI which doesn't fit within the guidelines of an alert then we recommend building the form within a modal instead.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                       |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `animated`        | `animated`         | If true, the alert will animate. Defaults to `true`.                                                             | `boolean`                  |
| `backdropDismiss` | `backdrop-dismiss` | If true, the alert will be dismissed when the backdrop is clicked. Defaults to `true`.                           | `boolean`                  |
| `buttons`         | --                 | Array of buttons to be added to the alert.                                                                       | `(AlertButton | string)[]` |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string`, `string[]`       |
| `enterAnimation`  | --                 | Animation to use when the alert is presented.                                                                    | `AnimationBuilder`         |
| `header`          | `header`           | The main title in the heading of the alert.                                                                      | `string`                   |
| `inputs`          | --                 | Array of input to show in the alert.                                                                             | `AlertInput[]`             |
| `keyboardClose`   | `keyboard-close`   | If true, the keyboard will be automatically dismissed when the overlay is presented.                             | `boolean`                  |
| `leaveAnimation`  | --                 | Animation to use when the alert is dismissed.                                                                    | `AnimationBuilder`         |
| `message`         | `message`          | The main message to be displayed in the alert.                                                                   | `string`                   |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                        | `Mode`                     |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`                   |
| `subHeader`       | `sub-header`       | The subtitle in the heading of the alert. Displayed under the title.                                             | `string`                   |
| `translucent`     | `translucent`      | If true, the alert will be translucent. Defaults to `false`.                                                     | `boolean`                  |


## Events

| Event                 | Description                             |
| --------------------- | --------------------------------------- |
| `ionAlertDidDismiss`  | Emitted after the alert has dismissed.  |
| `ionAlertDidLoad`     | Emitted after the alert has presented.  |
| `ionAlertDidPresent`  | Emitted after the alert has presented.  |
| `ionAlertDidUnload`   | Emitted before the alert has presented. |
| `ionAlertWillDismiss` | Emitted before the alert has dismissed. |
| `ionAlertWillPresent` | Emitted before the alert has presented. |


## Methods

| Method          | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `dismiss`       | Dismiss the alert overlay after it has been presented.       |
| `onDidDismiss`  | Returns a promise that resolves when the alert did dismiss.  |
| `onWillDismiss` | Returns a promise that resolves when the alert will dismiss. |
| `present`       | Present the alert overlay after it has been created.         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

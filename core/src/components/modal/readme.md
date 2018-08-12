# ion-modal

A Modal is a dialog that appears on top of the app's content, and must be dismissed by the app before interaction can resume. It is useful as a select component when there are a lot of options to choose from, or when filtering items in a list, as well as many other use cases.


### Creating

Modals can be created using a [Modal Controller](../../modal-controller/ModalController). They can be customized by passing modal options in the modal controller's create method.



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description                                                                                                      | Type                |
| ----------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------- |
| `componentProps`        | --                        | The data to pass to the modal component.                                                                         | `ComponentProps`    |
| `component`             | `component`               | The component to display inside of the modal.                                                                    | `ComponentRef`      |
| `cssClass`              | `css-class`               | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string | string[]` |
| `delegate`              | --                        |                                                                                                                  | `FrameworkDelegate` |
| `enableBackdropDismiss` | `enable-backdrop-dismiss` | If true, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.                           | `boolean`           |
| `enterAnimation`        | --                        | Animation to use when the modal is presented.                                                                    | `AnimationBuilder`  |
| `keyboardClose`         | `keyboard-close`          |                                                                                                                  | `boolean`           |
| `leaveAnimation`        | --                        | Animation to use when the modal is dismissed.                                                                    | `AnimationBuilder`  |
| `overlayId`             | `overlay-id`              |                                                                                                                  | `number`            |
| `showBackdrop`          | `show-backdrop`           | If true, a backdrop will be displayed behind the modal. Defaults to `true`.                                      | `boolean`           |
| `willAnimate`           | `will-animate`            | If true, the modal will animate. Defaults to `true`.                                                             | `boolean`           |


## Events

| Event                 | Description                             |
| --------------------- | --------------------------------------- |
| `ionModalDidDismiss`  | Emitted after the modal has dismissed.  |
| `ionModalDidLoad`     | Emitted after the modal has loaded.     |
| `ionModalDidPresent`  | Emitted after the modal has presented.  |
| `ionModalDidUnload`   | Emitted after the modal has unloaded.   |
| `ionModalWillDismiss` | Emitted before the modal has dismissed. |
| `ionModalWillPresent` | Emitted before the modal has presented. |


## Methods

| Method          | Description                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `dismiss`       | Dismiss the modal overlay after it has been presented.                                                                           |
| `onDidDismiss`  | Returns a promise that resolves when the modal did dismiss. It also accepts a callback that is called in the same circustances.  |
| `onWillDismiss` | Returns a promise that resolves when the modal will dismiss. It also accepts a callback that is called in the same circustances. |
| `present`       | Present the modal overlay after it has been created.                                                                             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

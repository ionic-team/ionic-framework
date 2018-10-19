# ion-modal

A Modal is a dialog that appears on top of the app's content, and must be dismissed by the app before interaction can resume. It is useful as a select component when there are a lot of options to choose from, or when filtering items in a list, as well as many other use cases.


### Creating

Modals can be created using a [Modal Controller](../../modal-controller/ModalController). They can be customized by passing modal options in the modal controller's create method.



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                                        |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `animated`        | `animated`         | If `true`, the modal will animate. Defaults to `true`.                                                           | `boolean`                                   |
| `backdropDismiss` | `backdrop-dismiss` | If `true`, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.                         | `boolean`                                   |
| `componentProps`  | --                 | The data to pass to the modal component.                                                                         | `undefined \| { [key: string]: any; }`      |
| `component`       | `component`        | The component to display inside of the modal.                                                                    | `Function \| HTMLElement \| null \| string` |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[] \| undefined`           |
| `delegate`        | --                 |                                                                                                                  | `FrameworkDelegate \| undefined`            |
| `enterAnimation`  | --                 | Animation to use when the modal is presented.                                                                    | `AnimationBuilder \| undefined`             |
| `keyboardClose`   | `keyboard-close`   | If `true`, the keyboard will be automatically dismissed when the overlay is presented.                           | `boolean`                                   |
| `leaveAnimation`  | --                 | Animation to use when the modal is dismissed.                                                                    | `AnimationBuilder \| undefined`             |
| `mode`            | `mode`             | The mode determines which platform styles to use. Possible values are: `"ios"` or `"md"`.                        | `"ios" \| "md"`                             |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`                                    |
| `showBackdrop`    | `show-backdrop`    | If `true`, a backdrop will be displayed behind the modal. Defaults to `true`.                                    | `boolean`                                   |


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

### `dismiss(data?: any, role?: string | undefined) => Promise<boolean>`

Dismiss the modal overlay after it has been presented.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `onDidDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the modal did dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `onWillDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the modal will dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `present() => Promise<void>`

Present the modal overlay after it has been created.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

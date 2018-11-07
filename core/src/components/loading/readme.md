# ion-loading

An overlay that can be used to indicate activity while blocking user interaction. The loading indicator appears on top of the app's content, and can be dismissed by the app to resume user interaction with the app. It includes an optional backdrop, which can be disabled by setting `showBackdrop: false` upon creation.


### Creating

Loading indicators can be created using a [Loading Controller](../../loading-controller/LoadingController). They can be customized by passing loading options in the loading controller's create method. The spinner name should be passed in the `spinner` property, and any optional HTML can be passed in the `content` property. If a value is not passed to `spinner` the loading indicator will use the spinner specified by the platform.


### Dismissing

The loading indicator can be dismissed automatically after a specific amount of time by passing the number of milliseconds to display it in the `duration` of the loading options. By default the loading indicator will show even during page changes, but this can be disabled by setting `dismissOnPageChange` to `true`. To dismiss the loading indicator after creation, call the `dismiss()` method on the loading instance. The `onDidDismiss` function can be called to perform an action after the loading indicator is dismissed.


<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                                                      | Type                                                                                              |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `animated`        | `animated`         | If `true`, the loading indicator will animate.                                                                   | `boolean`                                                                                         |
| `backdropDismiss` | `backdrop-dismiss` | If `true`, the loading indicator will be dismissed when the backdrop is clicked.                                 | `boolean`                                                                                         |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[] \| undefined`                                                                 |
| `duration`        | `duration`         | Number of milliseconds to wait before dismissing the loading indicator.                                          | `number`                                                                                          |
| `enterAnimation`  | --                 | Animation to use when the loading indicator is presented.                                                        | `AnimationBuilder \| undefined`                                                                   |
| `keyboardClose`   | `keyboard-close`   | If `true`, the keyboard will be automatically dismissed when the overlay is presented.                           | `boolean`                                                                                         |
| `leaveAnimation`  | --                 | Animation to use when the loading indicator is dismissed.                                                        | `AnimationBuilder \| undefined`                                                                   |
| `message`         | `message`          | Optional text content to display in the loading indicator.                                                       | `string \| undefined`                                                                             |
| `mode`            | `mode`             | The mode determines which platform styles to use.                                                                | `"ios" \| "md"`                                                                                   |
| `overlayIndex`    | `overlay-index`    |                                                                                                                  | `number`                                                                                          |
| `showBackdrop`    | `show-backdrop`    | If `true`, a backdrop will be displayed behind the loading indicator.                                            | `boolean`                                                                                         |
| `spinner`         | `spinner`          | The name of the spinner to display.                                                                              | `"bubbles" \| "circles" \| "crescent" \| "dots" \| "lines" \| "lines-small" \| null \| undefined` |
| `translucent`     | `translucent`      | If `true`, the loading indicator will be translucent.                                                            | `boolean`                                                                                         |


## Events

| Event                   | Detail             | Description                               |
| ----------------------- | ------------------ | ----------------------------------------- |
| `ionLoadingDidDismiss`  | OverlayEventDetail | Emitted after the loading has dismissed.  |
| `ionLoadingDidLoad`     |                    | Emitted after the loading has loaded.     |
| `ionLoadingDidPresent`  |                    | Emitted after the loading has presented.  |
| `ionLoadingDidUnload`   |                    | Emitted after the loading has unloaded.   |
| `ionLoadingWillDismiss` | OverlayEventDetail | Emitted before the loading has dismissed. |
| `ionLoadingWillPresent` |                    | Emitted before the loading has presented. |


## Methods

### `dismiss(data?: any, role?: string | undefined) => Promise<boolean>`

Dismiss the loading overlay after it has been presented.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `onDidDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the loading did dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `onWillDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the loading will dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `present() => Promise<void>`

Present the loading overlay after it has been created.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# ion-toast-controller

ToastController is a component use to create Toast components. Please see the docs for [Toast](../toast).


<!-- Auto Generated Below -->


## Methods

### `create(options?: ToastOptions | undefined) => Promise<HTMLIonToastElement>`

Create a toast overlay with toast options.

#### Parameters

| Name      | Type                        | Description                             |
| --------- | --------------------------- | --------------------------------------- |
| `options` | `ToastOptions \| undefined` | The options to use to create the toast. |

#### Returns

Type: `Promise<HTMLIonToastElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open toast overlay.

#### Parameters

| Name   | Type                  | Description                                                                                               |
| ------ | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `data` | `any`                 | Any data to emit in the dismiss events.                                                                   |
| `role` | `string \| undefined` | The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.                |
| `id`   | `string \| undefined` | The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast. |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonToastElement | undefined>`

Get the most recently opened toast overlay.

#### Returns

Type: `Promise<HTMLIonToastElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# ion-toast-controller

ToastController is a component use to create Toast components. Please see the docs for [Toast](../toast).


<!-- Auto Generated Below -->


## Methods

### `create(opts?: ToastOptions | undefined) => Promise<any>`

Create a toast overlay with toast options.

#### Parameters

| Name   | Type                        | Description |
| ------ | --------------------------- | ----------- |
| `opts` | `ToastOptions \| undefined` |             |

#### Returns

Type: `Promise<any>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open toast overlay.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |
| `id`   | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<any>`

Get the most recently opened toast overlay.

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

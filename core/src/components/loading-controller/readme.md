# ion-loading-controller

Loading controllers programmatically control the loading component. Loadings can be created and dismissed from the loading controller. View the [Loading](../loading) documentation for a full list of options to pass upon creation.




<!-- Auto Generated Below -->


## Methods

### `create(opts?: LoadingOptions | undefined) => Promise<any>`

Create a loading overlay with loading options.

#### Parameters

| Name   | Type                          | Description |
| ------ | ----------------------------- | ----------- |
| `opts` | `LoadingOptions \| undefined` |             |

#### Returns

Type: `Promise<any>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open loading overlay.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |
| `id`   | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<any>`

Get the most recently opened loading overlay.

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

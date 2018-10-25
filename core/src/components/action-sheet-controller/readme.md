# ion-action-sheet-controller

Action Sheet controllers programmatically control the action sheet component. Action Sheets can be created and dismissed from the action sheet controller. View the [Action Sheet](../action-sheet) documentation for a full list of options to pass upon creation.

<!-- Auto Generated Below -->


## Methods

### `create(opts: ActionSheetOptions) => Promise<any>`

Create an action sheet overlay with action sheet options.

#### Parameters

| Name   | Type                 | Description |
| ------ | -------------------- | ----------- |
| `opts` | `ActionSheetOptions` |             |

#### Returns

Type: `Promise<any>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open action sheet overlay.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |
| `id`   | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<any>`

Get the most recently opened action sheet overlay.

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

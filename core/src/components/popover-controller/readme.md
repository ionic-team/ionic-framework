# ion-popover-controller

Popover controllers programmatically control the popover component. Popovers can be created and dismissed from the popover controller. View the [Popover](../popover) documentation for a full list of options to pass upon creation.


<!-- Auto Generated Below -->


## Methods

### `create<T extends ComponentRef>(opts: PopoverOptions<T>) => Promise<HTMLIonPopoverElement>`

Create a popover overlay with popover options.

#### Parameters

| Name   | Type                | Description |
| ------ | ------------------- | ----------- |
| `opts` | `PopoverOptions<T>` |             |

#### Returns

Type: `Promise<HTMLIonPopoverElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open popover overlay.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |
| `id`   | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonPopoverElement | undefined>`

Get the most recently opened popover overlay.

#### Returns

Type: `Promise<HTMLIonPopoverElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

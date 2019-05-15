# ion-picker-controller



<!-- Auto Generated Below -->


## Methods

### `create(options: PickerOptions) => Promise<HTMLIonPickerElement>`

Create a picker overlay with picker options.

#### Parameters

| Name      | Type            | Description                              |
| --------- | --------------- | ---------------------------------------- |
| `options` | `PickerOptions` | The options to use to create the picker. |

#### Returns

Type: `Promise<HTMLIonPickerElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open picker overlay.

#### Parameters

| Name   | Type                  | Description                                                                                                                                                                                                                                       |
| ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data` | `any`                 | Any data to emit in the dismiss events.                                                                                                                                                                                                           |
| `role` | `string \| undefined` | The role of the element that is dismissing the picker. This can be useful in a button handler for determining which button was clicked to dismiss the picker. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`. |
| `id`   | `string \| undefined` | The id of the picker to dismiss. If an id is not provided, it will dismiss the most recently opened picker.                                                                                                                                       |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonPickerElement | undefined>`

Get the most recently opened picker overlay.

#### Returns

Type: `Promise<HTMLIonPickerElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

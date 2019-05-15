# ion-modal-controller

Modal controllers programmatically control the modal component. Modals can be created and dismissed from the modal controller. View the [Modal](../modal) documentation for a full list of options to pass upon creation.


<!-- Auto Generated Below -->


## Methods

### `create<T extends ComponentRef>(options: ModalOptions<T>) => Promise<HTMLIonModalElement>`

Create a modal overlay with modal options.

#### Parameters

| Name      | Type              | Description                             |
| --------- | ----------------- | --------------------------------------- |
| `options` | `ModalOptions<T>` | The options to use to create the modal. |

#### Returns

Type: `Promise<HTMLIonModalElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open modal overlay.

#### Parameters

| Name   | Type                  | Description                                                                                                                                                                                                                                     |
| ------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data` | `any`                 | Any data to emit in the dismiss events.                                                                                                                                                                                                         |
| `role` | `string \| undefined` | The role of the element that is dismissing the modal. This can be useful in a button handler for determining which button was clicked to dismiss the modal. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`. |
| `id`   | `string \| undefined` | The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal.                                                                                                                                       |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonModalElement | undefined>`

Get the most recently opened modal overlay.

#### Returns

Type: `Promise<HTMLIonModalElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

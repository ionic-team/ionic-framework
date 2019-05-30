# ion-alert-controller

Alert controllers programmatically control the alert component. Alerts can be created and dismissed by the alert controller. View the [Alert](../alert) documentation for the list of options to pass upon creation and usage information.


<!-- Auto Generated Below -->


## Methods

### `create(options: AlertOptions) => Promise<HTMLIonAlertElement>`

Create an alert overlay with alert options.

#### Parameters

| Name      | Type           | Description                             |
| --------- | -------------- | --------------------------------------- |
| `options` | `AlertOptions` | The options to use to create the alert. |

#### Returns

Type: `Promise<HTMLIonAlertElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open alert overlay.

#### Parameters

| Name   | Type                  | Description                                                                                                                                                                                                                                     |
| ------ | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data` | `any`                 | Any data to emit in the dismiss events.                                                                                                                                                                                                         |
| `role` | `string \| undefined` | The role of the element that is dismissing the alert. This can be useful in a button handler for determining which button was clicked to dismiss the alert. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`. |
| `id`   | `string \| undefined` | The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.                                                                                                                                       |

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonAlertElement | undefined>`

Get the most recently opened alert overlay.

#### Returns

Type: `Promise<HTMLIonAlertElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

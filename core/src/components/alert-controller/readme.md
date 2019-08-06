# ion-alert-controller

Alert controllers programmatically control the alert component. Alerts can be created and dismissed by the alert controller. View the [Alert](../alert) documentation for the list of options to pass upon creation and usage information.


<!-- Auto Generated Below -->


## Methods

### `create(options: AlertOptions) => Promise<HTMLIonAlertElement>`

Create an alert overlay with alert options.

#### Returns

Type: `Promise<HTMLIonAlertElement>`



### `dismiss(data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>`

Dismiss the open alert overlay.

#### Returns

Type: `Promise<boolean>`



### `getTop() => Promise<HTMLIonAlertElement | undefined>`

Get the most recently opened alert overlay.

#### Returns

Type: `Promise<HTMLIonAlertElement | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

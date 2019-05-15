# ion-alert-controller

Alert controllers programmatically control the alert component. Alerts can be created and dismissed from the alert controller. View the [Alert](../alert) documentation for a full list of options to pass upon creation.


```javascript
async function presentAlert() {
  const alertController = document.querySelector('ion-alert-controller');
  await alertController.componentOnReady();

  const alert = await alertController.create({
    header: 'Alert',
    subHeader: 'Subtitle',
    message: 'This is an alert message.',
    buttons: ['OK']
  });
  return await alert.present();
}
```


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

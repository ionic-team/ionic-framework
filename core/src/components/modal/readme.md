# ion-modal

A Modal is a dialog that appears on top of the app's content, and must be dismissed by the app before interaction can resume. It is useful as a select component when there are a lot of options to choose from, or when filtering items in a list, as well as many other use cases.


### Creating

Modals can be created using a [Modal Controller](../../modal-controller/ModalController). They can be customized by passing modal options in the modal controller's create method.



<!-- Auto Generated Below -->


## Usage

### Angular

```typescript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
@Component({
  selector: 'modal-example',
  templateUrl: 'modal-example.html',
  styleUrls: ['./modal-example.css']
})
export class ModalExample {
  constructor(public modalController: ModalController) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
}
```


### Javascript

```javascript
async function presentModal() {
  // initialize controller
  const modalController = document.querySelector('ion-modal-controller');
  await modalController.componentOnReady();

  // create component to open
  const element = document.createElement('div');
  element.innerHTML = `
  &lt;ion-header&gt;
    &lt;ion-toolbar&gt;
      &lt;ion-title&gt;Super Modal&lt;/ion-title&gt;
    &lt;/ion-toolbar&gt;
  &lt;/ion-header&gt;
  &lt;ion-content&gt;
    &lt;h1&gt;Content of doom&lt;/h1&gt;
    &lt;div&gt;Here's some more content&lt;/div&gt;
    &lt;ion-button class="dismiss"&gt;Dismiss Modal&lt;/ion-button&gt;
  &lt;/ion-content&gt;
  `;

  // listen for close event
  const button = element.querySelector('ion-button');
  button.addEventListener('click', () => {
    modalController.dismiss();
  });

  // present the modal
  const modalElement = await modalController.create({
    component: element
  });
  modalElement.present();
}
```



## Properties

| Property          | Attribute          | Description                                                                                                      | Type                                                                                   | Default     |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| `animated`        | `animated`         | If `true`, the modal will animate.                                                                               | `boolean`                                                                              | `true`      |
| `backdropDismiss` | `backdrop-dismiss` | If `true`, the modal will be dismissed when the backdrop is clicked.                                             | `boolean`                                                                              | `true`      |
| `component`       | `component`        | The component to display inside of the modal.                                                                    | `Function \| HTMLElement \| null \| string`                                            | `undefined` |
| `componentProps`  | --                 | The data to pass to the modal component.                                                                         | `undefined \| { [key: string]: any; }`                                                 | `undefined` |
| `cssClass`        | `css-class`        | Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[] \| undefined`                                                      | `undefined` |
| `enterAnimation`  | --                 | Animation to use when the modal is presented.                                                                    | `((Animation: Animation, baseEl: any, opts?: any) => Promise<Animation>) \| undefined` | `undefined` |
| `keyboardClose`   | `keyboard-close`   | If `true`, the keyboard will be automatically dismissed when the overlay is presented.                           | `boolean`                                                                              | `true`      |
| `leaveAnimation`  | --                 | Animation to use when the modal is dismissed.                                                                    | `((Animation: Animation, baseEl: any, opts?: any) => Promise<Animation>) \| undefined` | `undefined` |
| `mode`            | `mode`             | The mode determines which platform styles to use.                                                                | `"ios" \| "md"`                                                                        | `undefined` |
| `showBackdrop`    | `show-backdrop`    | If `true`, a backdrop will be displayed behind the modal.                                                        | `boolean`                                                                              | `true`      |


## Events

| Event                 | Description                             | Detail             |
| --------------------- | --------------------------------------- | ------------------ |
| `ionModalDidDismiss`  | Emitted after the modal has dismissed.  | OverlayEventDetail |
| `ionModalDidLoad`     | Emitted after the modal has loaded.     | void               |
| `ionModalDidPresent`  | Emitted after the modal has presented.  | void               |
| `ionModalDidUnload`   | Emitted after the modal has unloaded.   | void               |
| `ionModalWillDismiss` | Emitted before the modal has dismissed. | OverlayEventDetail |
| `ionModalWillPresent` | Emitted before the modal has presented. | void               |


## Methods

### `dismiss(data?: any, role?: string | undefined) => Promise<boolean>`

Dismiss the modal overlay after it has been presented.

#### Parameters

| Name   | Type                  | Description |
| ------ | --------------------- | ----------- |
| `data` | `any`                 |             |
| `role` | `string \| undefined` |             |

#### Returns

Type: `Promise<boolean>`



### `onDidDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the modal did dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `onWillDismiss() => Promise<OverlayEventDetail<any>>`

Returns a promise that resolves when the modal will dismiss.

#### Returns

Type: `Promise<OverlayEventDetail<any>>`



### `present() => Promise<void>`

Present the modal overlay after it has been created.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

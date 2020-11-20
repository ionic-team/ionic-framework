
```javascript
customElements.define('modal-page', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title>Modal Header</ion-title>
    <ion-buttons slot="primary">
      <ion-button onClick="dismissModal()">
        <ion-icon slot="icon-only" name="close"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  Modal Content
</ion-content>`;
  }
});

function presentModal() {
  // create the modal with the `modal-page` component
  const modalElement = document.createElement('ion-modal');
  modalElement.component = 'modal-page';
  modalElement.cssClass = 'my-custom-class';

  // present the modal
  document.body.appendChild(modalElement);
  return modalElement.present();
}
```

> If you need a wrapper element inside of your modal component, we recommend using a `<div class="ion-page">` so that the component dimensions are still computed properly.

### Passing Data

During creation of a modal, data can be passed in through the `componentProps`. The previous example can be written to include data:

```javascript
const modalElement = document.createElement('ion-modal');
modalElement.component = 'modal-page';
modalElement.cssClass = 'my-custom-class';
modalElement.componentProps = {
  'firstName': 'Douglas',
  'lastName': 'Adams',
  'middleInitial': 'N'
};
```

To get the data passed into the `componentProps`, query for the modal in the `modal-page`:

```js
customElements.define('modal-page', class extends HTMLElement {
  connectedCallback() {
    const modalElement = document.querySelector('ion-modal');
    console.log(modalElement.componentProps.firstName);

    ...
  }
}
```


### Dismissing a Modal

A modal can be dismissed by calling the dismiss method and optionally passing any data from the modal.

```javascript
async function dismissModal() {
  await modal.dismiss({
    'dismissed': true
  });
}
```

After being dismissed, the data can be read in through the `onWillDismiss` or `onDidDismiss` attached to the modal after creation:

```javascript
const { data } = await modalElement.onWillDismiss();
console.log(data);
```


### Swipeable Modals

Modals in iOS mode have the ability to be presented in a card-style and swiped to close. The card-style presentation and swipe to close gesture are not mutually exclusive, meaning you can pick and choose which features you want to use. For example, you can have a card-style modal that cannot be swiped or a full sized modal that can be swiped.

> Card style modals when running on iPhone-sized devices do not have backdrops. As a result, the `--backdrop-opacity` variable will not have any effect.

```javascript
const modalElement = document.createElement('ion-modal');
modalElement.component = 'modal-page';
modalElement.cssClass = 'my-custom-class';
modalElement.swipeToClose = true;
modalElement.presentingElement = document.querySelector('ion-nav');
```

In most scenarios, using the `ion-nav` element as the `presentingElement` is fine. In cases where you are presenting a card-style modal from within a modal, you should pass in the top-most `ion-modal` element as the `presentingElement`.

```javascript
const modalElement = document.createElement('ion-modal');
modalElement.component = 'modal-page';
modalElement.cssClass = 'my-custom-class';
modalElement.swipeToClose = true;
modalElement.presentingElement = await modalController.getTop(); // Get the top-most ion-modal
```

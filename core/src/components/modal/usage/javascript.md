```html
<body>
  <ion-modal-controller></ion-modal-controller>
</body>
```

```javascript
customElements.define('modal-page', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<ion-header>
  <ion-toolbar>
    <ion-title>Super Modal</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
  Content
</ion-content>`;
  }
});

async function presentModal() {
  // initialize controller
  const modalController = document.querySelector('ion-modal-controller');
  await modalController.componentOnReady();

  // present the modal
  const modalElement = await modalController.create({
    component: 'modal-page'
  });
  await modalElement.present();
}
```

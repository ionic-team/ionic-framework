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

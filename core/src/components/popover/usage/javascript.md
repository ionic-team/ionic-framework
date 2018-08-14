```javascript
async function presentPopover(ev) {
  const popoverController = document.querySelector('ion-popover-controller');
  await popoverController.componentOnReady();

  const popover = await popoverController.create({
    component: 'popover-example-page',
    translucent: true
    event,
  });
  return await popover.present();
}
```

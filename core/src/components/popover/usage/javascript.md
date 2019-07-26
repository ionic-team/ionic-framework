```javascript
async function presentPopover(ev) {
  const popoverController = document.querySelector('ion-popover-controller');

  const popover = await popoverController.create({
    component: 'popover-example-page',
    event: ev,
    translucent: true
  });
  return await popover.present();
}
```

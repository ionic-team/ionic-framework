```javascript
function presentPopover(ev) {
  const popover = Object.assing(document.createElement('ion-popover'), {
    component: 'popover-example-page',
    event: ev,
    translucent: true
  });
  document.body.appendChild(popover);
  return popover.present();
}
```

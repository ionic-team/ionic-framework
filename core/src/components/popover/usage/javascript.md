```javascript
function presentPopover(ev) {
  const popover = Object.assign(document.createElement('ion-popover'), {
    component: 'popover-example-page',
    event: ev,
    translucent: true
  });
  document.body.appendChild(popover);
  return popover.present();
}
```

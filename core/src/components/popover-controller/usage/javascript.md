```javascript
async function presentPopover() {
  const popoverElement = Object.assing(document.createElement('ion-popover'), {
    component: 'profile-page',
    event: event
  });
  document.body.appendChild(popoverElement);
  return await popoverElement.present();
}
```

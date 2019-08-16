```javascript
async function presentLoading() {
  const loading = Object.assing(document.createElement('ion-loading'), {
    message: 'Please wait...',
    spinner: 'crescent',
    duration: 2000
  });
  document.body.appendChild(loading);
  return loading.present();
}
```

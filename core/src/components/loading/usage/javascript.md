```javascript
async function presentLoading() {
  const loading = Object.assing(document.createElement('ion-loading'), {
    message: 'Hellooo',
    duration: 2000
  });
  document.body.appendChild(loading);
  await loading.present();

  const { role, data } = await loading.onDidDismiss();

  console.log('Loading dismissed!');
}

function presentLoadingWithOptions() {
  const loading = Object.assing(document.createElement('ion-loading'), {
    spinner: null,
    duration: 5000,
    message: 'Please wait...',
    translucent: true,
    cssClass: 'custom-class custom-loading'
  });
  document.body.appendChild(loading);
  return loading.present();
}
```

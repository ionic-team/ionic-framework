```javascript
async function presentLoading() {
  const loading = document.createElement('ion-loading');
  loading.message: 'Hellooo',
  loading.duration: 2000;

  document.body.appendChild(loading);
  await loading.present();

  const { role, data } = await loading.onDidDismiss();

  console.log('Loading dismissed!');
}

function presentLoadingWithOptions() {
  const loading = document.createElement('ion-loading');
  loading.spinner = null;
  loading.duration = 5000;
  loading.message = 'Please wait...';
  loading.translucent = true;
  loading.cssClass = 'custom-class custom-loading';

  document.body.appendChild(loading);
  return loading.present();
}
```

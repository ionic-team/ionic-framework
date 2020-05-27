```javascript
async function presentLoading() {
  const loading = document.createElement('ion-loading');

  loading.cssClass = 'my-custom-class';
  loading.message = 'Please wait...';
  loading.duration = 2000;

  document.body.appendChild(loading);
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  console.log('Loading dismissed!');
}

async function presentLoadingWithOptions() {
  const loading = document.createElement('ion-loading');

  loading.cssClass = 'my-custom-class';
  loading.spinner = null;
  loading.duration = 5000;
  loading.message = 'Click the backdrop to dismiss early...';
  loading.translucent = true;
  loading.cssClass = 'custom-class custom-loading';
  loading.backdropDismiss = true;

  document.body.appendChild(loading);
  await loading.present();

  const { role, data } = await loading.onDidDismiss();
  console.log('Loading dismissed with role:', role);
}
```

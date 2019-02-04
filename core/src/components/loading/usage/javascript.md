```javascript
async function presentLoading() {
  const loadingController = document.querySelector('ion-loading-controller');
  await loadingController.componentOnReady();

  const loading = await loadingController.create({
    message: 'Hellooo',
    duration: 2000
  });
  
  await loading.present();
    
  const { role, data } = await loading.onDidDismiss();
  
  console.log('Loading dismissed!');
}

async function presentLoadingWithOptions() {
  const loadingController = document.querySelector('ion-loading-controller');
  await loadingController.componentOnReady();

  const loading = await loadingController.create({
    spinner: null,
    duration: 5000,
    message: 'Please wait...',
    translucent: true,
    cssClass: 'custom-class custom-loading'
  });
  return await loading.present();
}
```

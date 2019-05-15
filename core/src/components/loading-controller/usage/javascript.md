```javascript
async function presentLoading() {
  const loadingController = document.querySelector('ion-loading-controller');
  await loadingController.componentOnReady();

  const loadingElement = await loadingController.create({
    message: 'Please wait...',
    spinner: 'crescent',
    duration: 2000
  });
  return await loadingElement.present();
}
```

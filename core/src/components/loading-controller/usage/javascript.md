```javascript
async function presentLoading() {
  const loadingController = document.querySelector('ion-loading-controller');

  const loadingElement = await loadingController.create({
    message: 'Please wait...',
    spinner: 'crescent',
    duration: 2000
  });
  return await loadingElement.present();
}
```

```javascript
async function presentToast() {
  const toastController = document.querySelector('ion-toast-controller');
  await toastController.componentOnReady();

  const toast = await toastController.create({
    message: 'Your settings have been saved.',
    duration: 2000
  });
  return await toast.present();
}

async function presentToastWithOptions() {
  const toastController = document.querySelector('ion-toast-controller');
  await toastController.componentOnReady();

  const toast = await toastController.create({
    message: 'Click to Close',
    showCloseButton: true,
    position: 'top',
    closeButtonText: 'Done'
  });
  return await toast.present();
}
```

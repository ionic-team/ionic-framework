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
    header: 'Toast header',
      message: 'Click to Close',
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Done',
      buttons: [
        {
          slot: 'start',
          icon: 'star',
          text: 'Fave',
          handler: () => {
            console.log('favorite clicked');
          }
        }
      ]
  });
  return await toast.present();
}
```

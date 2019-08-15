```javascript
async function presentToast() {
  const toast = Object.assing(document.createElement('ion-toast'), {
    message: 'Your settings have been saved.',
    duration: 2000
  });
  document.body.appendChild(toast);
  return toast.present();
}

async function presentToastWithOptions() {
  const toast = Object.assing(document.createElement('ion-toast'), {
    header: 'Toast header',
    message: 'Click to Close',
    position: 'top',
    buttons: [
      {
        side: 'start',
        icon: 'star',
        text: 'Favorite',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Done',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  document.body.appendChild(toast);
  return toast.present();
}
```

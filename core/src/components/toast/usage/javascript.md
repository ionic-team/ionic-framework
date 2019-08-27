```javascript
async function presentToast() {
  const toast = document.createElement('ion-toast');
  toast.message = 'Your settings have been saved.';
  toast.duration = 2000;

  document.body.appendChild(toast);
  return toast.present();
}

async function presentToastWithOptions() {
  const toast = document.createElement('ion-toast');
  toast.header = 'Toast header';
  toast.message = 'Click to Close';
  toast.position = 'top';
  toast.buttons = [
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
  ];

  document.body.appendChild(toast);
  return toast.present();
}
```

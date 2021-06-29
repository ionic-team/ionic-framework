```typescript
import { Component, h } from '@stencil/core';
import { alertController } from '@ionic/core';

@Component({
  tag: 'router-example',
  styleUrl: 'router-example.css'
})
export class RouterExample {
  render() {
    return (
      <ion-router>
        <ion-route url="/home" component="page-home"></ion-route>
        <ion-route url="/dashboard" component="page-dashboard" beforeEnter={isLoggedInGuard}></ion-route>
        <ion-route url="/new-message" component="page-new-message" beforeLeave={hasUnsavedDataGuard}></ion-route>
        <ion-route url="/login" component="page-login"></ion-route>
      </ion-router>
    )
  }
}

const isLoggedInGuard = async () => {
  const isLoggedIn = await UserData.isLoggedIn(); // Replace this with actual login validation
  
  if (isLoggedIn) {
    return true;
  } else {
    return { redirect: '/login' }; // If a user is not logged in, they will be redirected to the /login page
  }
}

const hasUnsavedDataGuard = async () => {
  const hasUnsavedData = await checkData(); // Replace this with actual validation
  
  if (hasUnsavedData) {
    return await confirmDiscardChanges();
  } else {
    return true;
  }
}

const confirmDiscardChanges = async () => {
  const alert = await alertController.create({
    header: 'Discard Unsaved Changes?',
    message: 'Are you sure you want to leave? Any unsaved changed will be lost.',
    buttons: [
      {
        text: 'Cancel',
        role: 'Cancel',
      },
      {
        text: 'Discard',
        role: 'destructive',
      }
    ]
  });
  
  await alert.present();
  
  const { role } = await alert.onDidDismiss();
  
  return (role === 'Cancel') ? false : true;
}
```

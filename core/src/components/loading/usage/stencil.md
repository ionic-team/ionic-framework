```tsx
import { Component, h } from '@stencil/core';

import { loadingController } from '@ionic/core';

@Component({
  tag: 'loading-example',
  styleUrl: 'loading-example.css'
})
export class LoadingExample {
  async presentLoading() {
    const loading = await loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!', role, data);
  }

  async presentLoadingWithOptions() {
    const loading = await loadingController.create({
      cssClass: 'my-custom-class',
      spinner: null,
      duration: 5000,
      message: 'Click the backdrop to dismiss early...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role, data);
  }

  render() {
    return [
      <ion-content>
        <ion-button onClick={() => this.presentLoading()}>Present Loading</ion-button>
        <ion-button onClick={() => this.presentLoadingWithOptions()}>Present Loading: Options</ion-button>
      </ion-content>
    ];
  }
}
```
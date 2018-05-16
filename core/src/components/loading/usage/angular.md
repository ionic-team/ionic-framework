```typescript
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'loading-example',
  templateUrl: 'loading-example.html',
  styleUrls: ['./loading-example.css'],
})
export class LoadingExample {

  constructor(public loadingController: LoadingController) {}

  presentLoading() {
    const loading = this.loadingController.create({
      message: 'Hellooo',
      duration: 2000
    });
    loading.present();
  }

  presentLoadingWithOptions() {
    const loading = this.loadingController.create({
      spinner: 'hide',
      duration: 5000,
      content: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    loading.present();
  }

}
```

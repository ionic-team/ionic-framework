```typescript
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
@Component({
  selector: 'modal-example',
  templateUrl: 'modal-example.html',
  styleUrls: ['./modal-example.css']
})
export class ModalExample {
  constructor(public modalController: ModalController) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }
}
```

```typescript
import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'modal-page',
})
export class ModalExample {

  // "value" passed in componentProps
  @Input() value: number;

  constructor(navParams: NavParams) {
    // componentProps can also be accessed at construction time using NavParams
  }

}
```

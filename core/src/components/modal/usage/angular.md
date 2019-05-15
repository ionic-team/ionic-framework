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
import { Component, Input } from '@angular/core';
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

#### Lazy Loading

When lazy loading a modal, it's important to note that the modal will not be loaded when it is opened, but rather when the module that imports the modal's module is loaded.

For example, say there exists a `CalendarComponent` and an `EventModal`. The modal is presented by clicking a button in the `CalendarComponent`. In Angular, the `EventModalModule` would need to be included in the `CalendarComponentModule` since the modal is created in the `CalendarComponent`:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { CalendarComponent } from './calendar.component';
import { EventModalModule } from '../modals/event/event.module';

@NgModule({
    declarations: [
        CalendarComponent
    ],
    imports: [
      IonicModule,
      CommonModule,
      EventModalModule
    ],
    exports: [
      CalendarComponent
    ]
})

export class CalendarComponentModule {}
```
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
  constructor(public modalController: ModalController) {

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
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
export class ModalPage {

  constructor() {

  }

}
```

### Passing Data

During creation of a modal, data can be passed in through the `componentProps`. The previous example can be written to include data:

```typescript
async presentModal() {
  const modal = await this.modalController.create({
    component: ModalPage,
    componentProps: {
      'firstName': 'Douglas',
      'lastName': 'Adams',
      'middleInitial': 'N'
    }
  });
  return await modal.present();
}
```

To get the data passed into the `componentProps`, either set it as an `@Input` or access it via `NavParams` on the `ModalPage`:

```typescript
export class ModalPage {

  // Data passed in by componentProps
  @Input() firstName: string;
  @Input() lastName: string;
  @Input() middleInitial: string;

  constructor(navParams: NavParams) {
    // componentProps can also be accessed at construction time using NavParams
    console.log(navParams.get('firstName'));
  }

}
```

### Dismissing a Modal

A modal can be dismissed by calling the dismiss method on the modal controller and optionally passing any data from the modal.

```javascript
export class ModalPage {
  ...

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
```

After being dismissed, the data can be read in through the `onWillDismiss` or `onDidDismiss` attached to the modal after creation:

```javascript
const { data } = await modal.onWillDismiss();
console.log(data);
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

### Swipeable Modals

Modals in iOS mode have the ability to be presented in a card-style and swiped to close. The card-style presentation and swipe to close gesture are not mutually exclusive, meaning you can pick and choose which features you want to use. For example, you can have a card-style modal that cannot be swiped or a full sized modal that can be swiped.

If you are creating an application that uses `ion-tabs`, it is recommended that you get the parent `ion-router-outlet` using `this.routerOutlet.parentOutlet.nativeEl`, otherwise the tabbar will not scale down when the modal opens.

```javascript
import { IonRouterOutlet } from '@ionic/angular';

constructor(private routerOutlet: IonRouterOutlet) {}

async presentModal() {
  const modal = await this.modalController.create({
    component: ModalPage,
    swipeToClose: true,
    presentingElement: this.routerOutlet.nativeEl
  });
  return await modal.present();
}
```

In most scenarios, using the `ion-router-outlet` element as the `presentingElement` is fine. In cases where you are presenting a card-style modal from within another modal, you should pass in the top-most `ion-modal` element as the `presentingElement`.

```javascript
import { ModalController } from '@ionic/angular';

constructor(private modalCtrl: ModalController) {}

async presentModal() {
  const modal = await this.modalController.create({
    component: ModalPage,
    swipeToClose: true,
    presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
  });
  return await modal.present();
}
```

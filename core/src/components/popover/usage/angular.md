```typescript
import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'popover-example',
  templateUrl: 'popover-example.html',
  styleUrls: ['./popover-example.css'],
})
export class PopoverExample {

  constructor(public popoverController: PopoverController) {}

  presentPopover(ev: any) {
    const popover = this.popoverController.create({
      component: 'popover-example-page',
      ev: event,
      translucent: true
    });
    popover.present();
  }

}
```

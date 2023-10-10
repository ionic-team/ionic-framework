import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-overlay-controllers',
  templateUrl: './overlay-controllers.component.html',
  standalone: true,
})
export class OverlayControllersComponent {
  constructor(private modalCtrl: ModalController, private popoverCtrl: PopoverController) {}

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: DialogComponent
    });

    await modal.present();
  }

  async openPopover(ev: MouseEvent) {
    const popover = await this.popoverCtrl.create({
      component: DialogComponent,
      event: ev
    });

    await popover.present();
  }
}

@Component({
  selector: 'app-dialog-content',
  template: '<div class="ion-padding">Dialog Content</div>',
  standalone: true,
})
class DialogComponent {
}

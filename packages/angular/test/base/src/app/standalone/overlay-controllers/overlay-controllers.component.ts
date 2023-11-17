import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  PickerController,
  PopoverController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-overlay-controllers',
  templateUrl: './overlay-controllers.component.html',
  standalone: true,
})
export class OverlayControllersComponent {
  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController,
    private popoverCtrl: PopoverController
  ) {}

  async openAlert() {
    const alert = await this.alertCtrl.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
      header: 'Alert!',
    });

    await alert.present();
  }

  async openLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 2000,
    });

    await loading.present();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: DialogComponent,
    });

    await modal.present();
  }

  async openPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    await picker.present();
  }

  async openPopover(ev: MouseEvent) {
    const popover = await this.popoverCtrl.create({
      component: DialogComponent,
      event: ev,
    });

    await popover.present();
  }
}

@Component({
  selector: 'app-dialog-content',
  template: '<div class="ion-padding">Dialog Content</div>',
  standalone: true,
})
class DialogComponent {}

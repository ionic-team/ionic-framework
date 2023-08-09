import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AccordionModalComponent } from './accordion-modal/accordion-modal.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {

  constructor(
    private modalCtrl: ModalController
  ) { }

  async open() {
    const modal = await this.modalCtrl.create({
      component: AccordionModalComponent,
      animated: false,
    });
    await modal.present();
  }
}

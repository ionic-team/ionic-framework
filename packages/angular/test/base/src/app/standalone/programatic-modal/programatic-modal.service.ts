import { inject, Injectable } from '@angular/core';
import { ModalController } from "@ionic/angular/standalone";
import { ModalComponent } from "./modal/modal.component";

@Injectable({
  providedIn: 'root'
})
export class ProgramaticModalService {
  #modalController = inject(ModalController);

  async open() {
    const modal = await this.#modalController.create({
      component: ModalComponent,
      focusTrap: true,
    });
    await modal.present();
  }
}

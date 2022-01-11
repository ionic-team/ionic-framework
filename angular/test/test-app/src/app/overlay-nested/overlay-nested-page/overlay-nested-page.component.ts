import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { OverlayNestedExampleComponent } from "../overlay-nested-example";


@Component({
  selector: 'app-overlay-nested-page',
  templateUrl: 'overlay-nested-page.component.html'
})
export class OverlayNestedPageComponent {

  constructor(private modalCtrl: ModalController) { }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: OverlayNestedExampleComponent
    });
    modal.present();
  }
}

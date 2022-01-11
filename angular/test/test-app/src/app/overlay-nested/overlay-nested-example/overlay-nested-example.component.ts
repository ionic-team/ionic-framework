import { Component } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: 'app-overlay-nested-example',
  templateUrl: 'overlay-nested-example.component.html'
})
export class OverlayNestedExampleComponent {

  constructor(private modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}

import { Component, Inject } from '@angular/core';
import { IonButton, IonModalToken } from "@ionic/angular/standalone";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [IonButton],
  standalone: true,
})
export class ModalComponent  {
  constructor(@Inject(IonModalToken) private modalToken: HTMLIonModalElement) {
    this.modalToken.onDidDismiss().then(() => {
      console.log('Modal dismissed');
    });
  }

  public close() {
    this.modalToken.dismiss();
  }
}

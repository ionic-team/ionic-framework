import { Component } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [IonButton],
  standalone: true,
})
export class ModalComponent  {
}

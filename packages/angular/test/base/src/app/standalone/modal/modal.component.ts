import { Component } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-test',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [IonModal]
})
export class ModalComponent {
}

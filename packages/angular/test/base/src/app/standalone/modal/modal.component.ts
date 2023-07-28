import { Component } from '@angular/core';
import { IonModal } from '@ionic/angular/standalone';

@Component({
  selector: 'app-test',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [IonModal]
})
export class ModalComponent {
}

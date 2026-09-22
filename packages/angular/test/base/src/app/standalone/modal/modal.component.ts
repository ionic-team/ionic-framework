import { Component } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-test',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [IonModal]
})
export class ModalComponent {
  /* Reaches the input as `undefined`, the way an unresolved `async` pipe would. */
  unsetFocusTrap: boolean | undefined = undefined;
}

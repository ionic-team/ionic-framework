import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { ProgramaticModalService } from './programatic-modal.service';

@Component({
  selector: 'app-test',
  templateUrl: './programatic-modal.component.html',
  standalone: true,
  imports: [IonButton]
})
export class ProgramaticModalComponent {
  constructor(private modalService: ProgramaticModalService) {}

  public open() {
    this.modalService.open();
  }
}


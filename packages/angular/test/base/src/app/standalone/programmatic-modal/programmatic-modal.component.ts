import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { ProgrammaticModalService } from './programmatic-modal.service';

@Component({
  selector: 'app-test',
  templateUrl: './programmatic-modal.component.html',
  standalone: true,
  imports: [IonButton]
})
export class ProgrammaticModalComponent {
  constructor(private modalService: ProgrammaticModalService) {}

  public open() {
    this.modalService.open();
  }
}


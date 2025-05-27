import { Component } from '@angular/core';

@Component({
  selector: 'app-accordion-modal',
  templateUrl: './accordion-modal.component.html',
  standalone: false
})
export class AccordionModalComponent {
  modal!: HTMLIonModalElement;

  constructor() {}
}

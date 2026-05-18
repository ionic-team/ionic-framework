import { Component, OnInit, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TestService } from '../test.service';

@Component({
  selector: 'app-popover-custom-injector-popover',
  template: `
    <ion-content>
      <p id="service-value">Service Value: {{ serviceValue }}</p>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent]
})
export class PopoverCustomInjectorPopoverComponent implements OnInit {
  private testService = inject(TestService);
  serviceValue = '';

  ngOnInit() {
    this.serviceValue = this.testService.getValue();
  }
}

import { Component, inject, Injector } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, PopoverController } from '@ionic/angular/standalone';
import { PopoverCustomInjectorPopoverComponent } from './popover/popover.component';
import { TestService } from './test.service';

@Component({
  selector: 'app-popover-custom-injector',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Popover Custom Injector Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button id="open-popover-with-custom-injector" (click)="openWithCustomInjector($event)">
        Open Popover with Custom Injector
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton]
})
export class PopoverCustomInjectorComponent {
  private popoverController = inject(PopoverController);
  private injector = inject(Injector);

  async openWithCustomInjector(event: Event) {
    const testService = new TestService();
    testService.setValue('custom-injector-value');

    const customInjector = Injector.create({
      providers: [{ provide: TestService, useValue: testService }],
      parent: this.injector,
    });

    const popover = await this.popoverController.create({
      component: PopoverCustomInjectorPopoverComponent,
      event: event,
      injector: customInjector,
    });

    await popover.present();
  }
}

import { Component, inject, Injector } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, ModalController } from '@ionic/angular/standalone';
import { ModalCustomInjectorModalComponent } from './modal/modal.component';
import { TestService } from './test.service';

@Component({
  selector: 'app-modal-custom-injector',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal Custom Injector Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button id="open-modal-with-custom-injector" (click)="openWithCustomInjector()">
        Open Modal with Custom Injector
      </ion-button>
      <ion-button id="open-modal-without-custom-injector" (click)="openWithoutCustomInjector()">
        Open Modal without Custom Injector
      </ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton]
})
export class ModalCustomInjectorComponent {
  private modalController = inject(ModalController);
  private injector = inject(Injector);

  async openWithCustomInjector() {
    const testService = new TestService();
    testService.setValue('custom-injector-value');

    const customInjector = Injector.create({
      providers: [{ provide: TestService, useValue: testService }],
      parent: this.injector,
    });

    const modal = await this.modalController.create({
      component: ModalCustomInjectorModalComponent,
      injector: customInjector,
    });

    await modal.present();
  }

  async openWithoutCustomInjector() {
    try {
      const modal = await this.modalController.create({
        component: ModalCustomInjectorModalComponent,
      });
      await modal.present();
    } catch (e) {
      alert('Error: TestService not available without custom injector');
    }
  }
}

import { Component } from "@angular/core";
import { IonicModule, ModalController } from "@ionic/angular";

import { ModalExampleComponent } from "../modal-example/modal-example.component";
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-modal-nav',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal Nav</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button (click)="open()">Open Modal</ion-button>
    </ion-content>
  `,
})
export class ModalNavComponent {

  constructor(private modalCtrl: ModalController) { }

  private counter = 1;

  async open() {
    const modal = await this.modalCtrl.create({
      component: NavComponent,
      componentProps: {
        rootParams: {
          valueFromParams: `Hello world ${this.counter++}`
        }
      }
    });
    modal.present();
  }

}

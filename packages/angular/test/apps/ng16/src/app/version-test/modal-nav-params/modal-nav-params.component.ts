import { Component } from "@angular/core";

import { IonicModule } from "@ionic/angular";

import { NavRootComponent } from "./nav-root.component";

@Component({
  selector: 'app-modal-nav-params',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal Nav Params</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="open">Open Modal</ion-button>
      <ion-modal #modal trigger="open">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button (click)="modal.dismiss()">Close</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-nav [root]="root" [rootParams]="rootParams"></ion-nav>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, NavRootComponent]
})
export class ModalNavParamsComponent {

  root = NavRootComponent;
  rootParams = {
    params: {
      id: 123
    }
  };

}

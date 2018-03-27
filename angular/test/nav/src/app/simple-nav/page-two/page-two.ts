import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'page-two',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two
      <div>
        <ion-button routerLink="/simple-nav/page-three/paramOne/paramTwo">Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button routerLink="/simple-nav/page-one" goBack>Go to Page One</ion-button>
      </div>
    </ion-content>
  `
})
export class PageTwo {

}

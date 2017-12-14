import { Component } from '@angular/core';

@Component({
  selector: 'ion-app',
  template: `
    <ion-modal-container></ion-modal-container>
    <ng-content></ng-content>
  `
})
export class IonApp {

  constructor() {
    console.log('ion-app constructor');
  }
}



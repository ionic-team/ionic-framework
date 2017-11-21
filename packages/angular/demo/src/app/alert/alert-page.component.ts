import { Component } from '@angular/core';

import { AlertController } from '../../../../src/providers/alert-controller';

@Component({
  selector: 'app-alert-page',
  template: `
  <button (click)="clickMe()">Click Me</button>
  `
})
export class AlertPageComponent {

  constructor(private alertController: AlertController) {

  }

  clickMe() {
    const alert = this.alertController.create({
      message: 'Gretting from an ng cli app'
    });
    alert.present();
  }

}

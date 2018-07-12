import { Component, OnInit, ViewChild } from '@angular/core';
import { Button } from '@ionic/angular';

@Component({
  selector: 'app-button-page',
  template: `
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>Buttons</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button>Default</ion-button>
      <ion-button color="primary">Primary</ion-button>
      <ion-button [color]="dynamicColor" (click)="toggleColor()">{{ dynamicColor }}</ion-button>

      <p>
        <ion-button (click)="disableClick()" [disabled]="isDisabled">Disabled</ion-button>
        <ion-button (click)="isDisabled = !isDisabled">Toggle Disabled</ion-button>
      </p>
    </ion-content>
  </ion-app>
  `
})
export class ButtonPageComponent implements OnInit {
  dynamicColor = 'primary';
  isDisabled = true;

  @ViewChild(Button) button: Button;

  ngOnInit() {
    console.log(this.button);
  }

  disableClick() {
    console.log('Clicked disabled button');
  }

  toggleColor() {
    if (this.dynamicColor === 'primary') {
      this.dynamicColor = 'secondary';
    } else if (this.dynamicColor === 'secondary') {
      this.dynamicColor = 'danger';
    } else {
      this.dynamicColor = 'primary';
    }
  }
}

import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'ng-if-page',
  template: `
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>ngIf</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p padding>Value should stay the same after ngIf removes the component from the DOM then adds it back in.</p>
      <ion-list>
        <ion-item>
          <ion-label>Value: {{value}}</ion-label>
        </ion-item>
        <ion-item *ngIf="show">
          <ion-input value="{{value}}"></ion-input>
        </ion-item>
        <ion-item *ngIf="show">
          <ion-input [value]="value"></ion-input>
        </ion-item>
        <ion-item *ngIf="show">
          <ion-input [(ngModel)]="value"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button (click)="toggle()">ngIf {{ show ? 'hide' : 'show'}}</ion-button>
    </ion-content>
  </ion-app>
  `
})
export class NgIfPageComponent {

  value = Math.round(Math.random() * 10000000);
  show = true;

  toggle() {
    this.show = !this.show;
  }

}

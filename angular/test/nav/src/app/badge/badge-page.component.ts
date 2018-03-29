import { Component, ViewChild } from '@angular/core';
import { Badge } from '@ionic/angular';

@Component({
  selector: 'app-badge-page',
  template: `
  <ion-app>
  <ion-header>
    <ion-toolbar>
      <ion-title>Badges</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-list>
      <ion-list-header>Badges Right</ion-list-header>
      <ion-item>
        <ion-badge slot="end" color="primary">99</ion-badge>
        <ion-label>Default Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="end" color="primary">99</ion-badge>
        <ion-label>Primary Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="end" color="secondary">99</ion-badge>
        <ion-label>Secondary Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="end" color="danger">99</ion-badge>
        <ion-label>Danger Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="end" color="light">99</ion-badge>
        <ion-label>Light Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="end" color="dark">99</ion-badge>
        <ion-label>Dark Badge</ion-label>
      </ion-item>
      <ion-item (click)="toggleColor()">
        <ion-badge slot="end" [color]="dynamicColor">{{dynamicColor}}</ion-badge>
        <ion-label>Dynamic Badge Color (toggle)</ion-label>
      </ion-item>
    </ion-list>

    <ion-list>
      <ion-list-header>Badges Left</ion-list-header>
      <ion-item>
        <ion-badge slot="start" color="primary">99</ion-badge>
        <ion-label>Default Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="start" color="primary">99</ion-badge>
        <ion-label>Primary Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="start" color="secondary">99</ion-badge>
        <ion-label>Secondary Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="start" color="danger">99</ion-badge>
        <ion-label>Danger Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="start" color="light">99</ion-badge>
        <ion-label>Light Badge</ion-label>
      </ion-item>
      <ion-item>
        <ion-badge slot="start" color="dark">99</ion-badge>
        <ion-label>Dark Badge</ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
  </ion-app>
  `
})
export class BadgePageComponent {
  dynamicColor = 'primary';

  @ViewChild(Badge) badge: Badge;

  ngOnInit() {
    console.log(this.badge);
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

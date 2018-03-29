import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-page',
  template: `
    <ion-app>
      <ion-router-outlet stack></ion-router-outlet>
    </ion-app>
  `
})
export class SimpleNavPageComponent {}

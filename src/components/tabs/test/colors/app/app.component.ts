import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  templateUrl: 'app.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ion-tabs {
        margin-bottom: 20px;
        contain: none;
      }
    `,

    `
      ion-tabs,
      ion-tabs ion-tabbar {
        position: relative;
        top: auto;
        height: auto;
        visibility: visible;
        opacity: 1;
      }
    `
  ]
})
export class E2EApp {
  root = 'E2EPage';
}

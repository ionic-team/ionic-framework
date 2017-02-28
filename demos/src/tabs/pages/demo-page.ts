import { Component, ViewEncapsulation } from '@angular/core';
import { TabPage } from './tabs';

@Component({
  templateUrl: 'page.html',
  selector: 'api-demo-page',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      ion-tabs {
        margin-bottom: 20px;
      }
    `,
    `
      ion-tabs,
      ion-tabs .tabbar {
        position: relative;
        top: auto;
        height: auto;
        visibility: visible;
        opacity: 1;
      }
    `
  ]
})
export class ApiDemoPage {
  root = TabPage;
}

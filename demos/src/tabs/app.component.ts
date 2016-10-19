import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  template: '<div>johnny utah</div>',
  selector: 'tab-page'
})
export class TabPage {}


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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  selector: 'api-demo-app'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}

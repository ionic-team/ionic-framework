import { Component } from '@angular/core';

import { TabsPage } from '../pages/tabs-page/tabs-page';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = TabsPage;
}

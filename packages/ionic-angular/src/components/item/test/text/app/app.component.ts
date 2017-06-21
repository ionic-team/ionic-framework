import { Component } from '@angular/core';

import { RootPage } from '../pages/root-page/root-page';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  rootPage = RootPage;
}

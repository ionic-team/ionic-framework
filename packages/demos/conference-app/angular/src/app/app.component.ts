import { Component } from '@angular/core';

import { TabsPage } from '../pages/tabs-page/tabs-page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rootPage = TabsPage;
}

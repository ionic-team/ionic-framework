import { Component } from '@angular/core';
import { RootPage } from '../pages/root-page/root-page';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {
  rootPage = RootPage;
}

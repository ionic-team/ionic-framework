import { Component } from '@angular/core';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  templateUrl: 'app.template.html'
})
export class AppComponent {
  rootPage = PageOne;
}

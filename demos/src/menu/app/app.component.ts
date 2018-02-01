import { Component } from '@angular/core';
import { PageOne } from '../pages/page-one/page-one';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {
  root = PageOne;
}

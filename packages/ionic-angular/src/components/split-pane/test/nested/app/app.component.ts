import { Component } from '@angular/core';

import { PageOne } from '../pages/page-one/page-one';
import { SidePage } from '../pages/side-page/side-page';

@Component({
  templateUrl: 'app.component.html'
})
export class AppComponent {
  root = PageOne;
  root2 = SidePage;
}

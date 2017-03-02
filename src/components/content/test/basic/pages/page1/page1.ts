import { Component } from '@angular/core';

import { Page2 } from '../page2/page2';


@Component({
  templateUrl: 'page1.html'
})
export class Page1 {
  page2 = Page2;
}

import { Component } from '@angular/core';
import { PageTwo } from '../page-two/page-two';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  tabOne = PageTwo;
}
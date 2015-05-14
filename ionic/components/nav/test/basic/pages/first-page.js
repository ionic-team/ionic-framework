import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, Header, Toolbar, ToolbarTitle} from 'ionic/ionic';
import {SecondPage} from './second-page';


@Component({selector: 'ion-view'})
@View({
  templateUrl: 'pages/first-page.html',
  directives: [Header, ToolbarTitle, Toolbar]
})
export class FirstPage {
  constructor(
    nav: NavController
  ) {
    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;
  }

  push() {
    this.nav.push(SecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }
}

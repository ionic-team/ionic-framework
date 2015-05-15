import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavParams, Header, Toolbar, ToolbarTitle} from 'ionic/ionic';
import {ThirdPage} from './third-page';


@Component()
@View({
  templateUrl: 'pages/second-page.html',
  directives: [Header, Toolbar, ToolbarTitle]
})
export class SecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.params = params;

    console.log('Second page params:', params);
  }

  pop() {
    this.nav.pop();
  }

  push() {
    this.nav.push(ThirdPage);
  }

}

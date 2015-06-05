import {NgFor} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavParams, NavbarTemplate, Navbar, Content, Nav, List, Item} from 'ionic/ionic';

import {HackerNews} from '../hn'


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'pages/single.html',
  directives: [NavbarTemplate, Navbar, Content, NgFor, List, Item]
})
export class HNSinglePost {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.post = params;
    console.log('SINGLE', params);
  }
}

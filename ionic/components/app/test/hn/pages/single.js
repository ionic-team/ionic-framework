import {NgFor, bootstrap} from 'angular2/angular2';

import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavController, NavParams, HeaderTemplate, Toolbar, Content, Nav, NavPane, List, Item} from 'ionic/ionic';

import {HackerNews} from '../hn'

@Component({ selector: 'top-stories' })
@View({
  templateUrl: 'pages/single.html',
  directives: [HeaderTemplate, Toolbar, Content, NgFor, List, Item]
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

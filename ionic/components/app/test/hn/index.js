import {NgElement} from 'angular2/angular2';
import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {bind} from 'angular2/di';
import {Content, Nav, NavPane} from 'ionic/ionic';

import {HackerNews} from 'hn';
import {HNTopStories} from 'pages/top';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Nav, NavPane]
})
export class IonicApp {
  constructor(
    @NgElement() element:NgElement
  ) {
    console.log('IonicApp start: HackerNews', HackerNews)

    this.splashPage = HNTopStories
  }
}

export function main() {
  bootstrap(IonicApp);
}


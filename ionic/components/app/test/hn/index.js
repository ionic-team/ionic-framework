import {bootstrap, ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Nav, HeaderTemplate, Toolbar, Content} from 'ionic/ionic';

import {HackerNews} from './hn';
import {HNTopStories} from './pages/top';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Nav, Content, HeaderTemplate, Toolbar]
})
export class IonicApp {
  constructor(
    elementRef: ElementRef
  ) {
    console.log('IonicApp start: HackerNews', HackerNews)

    this.splashPage = HNTopStories
  }
}

export function main() {
  bootstrap(IonicApp);
}

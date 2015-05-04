import {Descendent, NgElement, Component, View, bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';
import {Content, Nav, NavPane} from 'ionic/ionic';

import {HackerNews} from 'hn';
import {HNTopStories} from 'pages/top';

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Nav, NavPane]
})
export class HNApp {
  constructor(
    @NgElement() element:NgElement
  ) {
    console.log('IonicApp start: HackerNews', HackerNews)

    this.splashPage = HNTopStories
  }
}

bootstrap(HNApp);


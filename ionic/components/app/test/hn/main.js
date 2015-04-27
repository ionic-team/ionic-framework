import {Descendent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {bind} from 'angular2/di';
import {View, Content, Nav, NavPane} from 'ionic/ionic';

import {HackerNews} from 'hn';
import {HNTopStories} from 'pages/top';

@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [View, Content, Nav, NavPane]
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


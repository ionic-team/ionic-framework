import {Descendent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {View, Content, Nav, NavPane} from 'ionic/ionic';

import {HackerNews} from 'hn';
import {HNSplashPage} from 'pages/splash';

@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html',
  directives: [View, Content, Nav, NavPane]
})
class IonicApp {
  constructor(
    @NgElement() element:NgElement
  ) {
    console.log('IonicApp start: HackerNews')

    this.splashPage = HNSplashPage

    // Timeout so Firebase can be resolved
    setTimeout(() => {
      this.hn = new HackerNews();
    });
  }
}

bootstrap(IonicApp)


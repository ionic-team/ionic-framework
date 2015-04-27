import {Descendent, Parent, NgElement, Component, View as NgView, bootstrap} from 'angular2/angular2';
import {View, Content, Nav, NavPane} from 'ionic/ionic';

@Component({ selector: 'splash-page' })
@NgView({
  templateUrl: 'pages/splash.html',
  directives: [View, Content]
})
export class HNSplashPage {
  constructor(@Parent() viewport: Nav) {
    //window.navPane = navPane;
  }
}

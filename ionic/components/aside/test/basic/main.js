import {Aside} from 'ionic/components/aside/aside';
import {Content} from 'ionic/components/content/content';
import {View} from 'ionic/components/view/view';
import {View as NgView, Component, bootstrap} from 'angular2/angular2';

@Component({
  selector: '[ion-app]'
})
@NgView({
  directives: [Aside, Content, View],
  templateUrl: 'main.html'
})
class App {
}

bootstrap(App);

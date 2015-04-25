import {Aside, Content, View} from 'ionic/ionic';
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

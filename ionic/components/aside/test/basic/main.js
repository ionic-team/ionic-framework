import {Aside} from 'ionic/components/aside/aside';
import {Content} from 'ionic/components/content/content';
import {View, Component, bootstrap} from 'angular2/angular2';


@Component({
  selector: '[ion-app]'
})
@View({
  directives: [Aside, Content],
  templateUrl: 'main.html'
})
class App {
}

bootstrap(App);

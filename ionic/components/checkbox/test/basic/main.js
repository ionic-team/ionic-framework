import {Component, View, bootstrap} from 'angular2/angular2';
import {View as NgView} from 'ionic/components/view/view';
import {Content, Icon, Checkbox, List} from 'ionic/components';

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [View, Content, Icon, Checkbox, List]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

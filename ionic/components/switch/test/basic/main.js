import {Component, View, bootstrap} from 'angular2/angular2';
import {Content} from 'ionic/components/content/content';
import {Switch} from 'ionic/components/switch/switch';
import {List} from 'ionic/components/list/list';

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Switch, List]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

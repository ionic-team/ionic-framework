import {Component, View, bootstrap} from 'angular2/angular2';
import {Content} from 'ionic/components/content/content';
import {Icon} from 'ionic/components/icon/icon';
import {Checkbox} from 'ionic/components/checkbox/checkbox';
import {List} from 'ionic/components/list/list';

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Icon, Checkbox, List]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

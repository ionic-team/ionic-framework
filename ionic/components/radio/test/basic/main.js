import {Component, View, bootstrap} from 'angular2/angular2';
import {Content} from 'ionic/components/content/content';
import {Icon} from 'ionic/components/icon/icon';
import {RadioGroup} from 'ionic/components/radio/radio-group';
import {RadioButton} from 'ionic/components/radio/radio-button';


@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Content, RadioGroup, RadioButton]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

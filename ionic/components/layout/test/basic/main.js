import {Component, View, bootstrap} from 'angular2/angular2';
import {Content} from 'ionic/components/content/content';
import {Layout} from 'ionic/components/layout/layout';


@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html',
  directives: [Content, Layout]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

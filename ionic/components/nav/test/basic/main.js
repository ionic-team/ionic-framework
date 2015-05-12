import {bootstrap} from 'angular2/angular2'
import {Nav} from 'ionic/components/nav/nav'
import {Log} from 'ionic/util'
import {FirstPage} from './pages/first-page'

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start');
  }
}

bootstrap(IonicApp);

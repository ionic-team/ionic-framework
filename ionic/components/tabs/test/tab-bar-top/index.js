import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs, Tab} from 'ionic/ionic';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Tabs, Tab]
})
export default class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Content, List, Item} from 'ionic/ionic';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item]
})
class IonicApp {}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}

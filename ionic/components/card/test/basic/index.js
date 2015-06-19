import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Content} from 'ionic/components/content/content';
import {List} from 'ionic/components/list/list';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List]
})
class IonicApp {}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}

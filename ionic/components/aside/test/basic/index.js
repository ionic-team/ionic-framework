import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Aside, List, Item, Content} from 'ionic/ionic';


@Component({
  selector: 'ion-view'
})
@View({
  directives: [Aside, Content, List, Item],
  templateUrl: 'main.html'
})
class IonicApp {}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}

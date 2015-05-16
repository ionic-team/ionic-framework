import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Aside, List, Item, Content, Button} from 'ionic/ionic';


@Component({
  selector: 'ion-app'
})
@View({
  directives: [Aside, Content, List, Item],
  templateUrl: 'main.html'
})
class IonicApp {
}

export function main() {
  bootstrap(IonicApp);
}

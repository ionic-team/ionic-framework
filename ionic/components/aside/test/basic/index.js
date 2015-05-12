import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Aside} from 'ionic/components/aside/aside';


@Component({
  selector: 'ion-app'
})
@View({
  directives: [Aside, Content],
  templateUrl: 'main.html'
})
class IonicApp {
}

export function main() {
  bootstrap(IonicApp);
}

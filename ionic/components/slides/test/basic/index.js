import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Slides, Slide, SlidePager, List, Item, Content, Button} from 'ionic/ionic';

@Component({
  selector: 'ion-app'
})
@View({
  directives: [Slides, Slide, SlidePager, Content],
  templateUrl: 'main.html'
})
class IonicApp {
}

export function main() {
  bootstrap(IonicApp);
}

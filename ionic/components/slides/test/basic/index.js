import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Slides, Slide, SlidePager, List, Item, Content, Button} from 'ionic/ionic';

@Component({
  selector: 'ion-app'
})
@View({
  directives: [Slides, Slide, SlidePager, Content, Button, List, Item],
  templateUrl: 'main.html'
})
class IonicApp {
  next() {
    console.log('Next');
  }
  prev() {
    console.log('Prev');
  }
}

export function main() {
  bootstrap(IonicApp);
}

import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Content, List, Item, Button} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, Button]
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }

  openModal() {
    console.log('Opening modal');
  }
}


export function main() {
  bootstrap(IonicApp);
}

import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Nav, Slides, Slide, Content, Button, List, Item} from 'ionic/ionic';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Nav, Slides, Slide, Content, Button, List, Item]
})
export class IonicApp {
  constructor() {
  }
}

export function main() {
  bootstrap(IonicApp);
}

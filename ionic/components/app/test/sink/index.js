import {bootstrap, ElementRef} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Ionic, Toolbar, ViewContainer, Aside, List, Item, Content, Button} from 'ionic/ionic';

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Aside, List, ViewContainer, Item, Content, Button]
})
export class IonicApp {
  constructor(elementRef: ElementRef) {
    Ionic.setRootElementRef(elementRef);
    console.log('IonicApp start: Kitchen Sink');
  }
}

export function main() {
  bootstrap(IonicApp).then((appRef) => {
    Ionic.setAppRef(appRef);
  })
}

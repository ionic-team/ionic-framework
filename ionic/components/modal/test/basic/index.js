import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Content, List, Item, Button, Modal} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, Button]
})
class IonicApp {
  constructor(loader: DynamicComponentLoader, domRenderer: DomRenderer, elementRef: ElementRef) {
    this.loader = loader;
    this.domRenderer = domRenderer;
    this.elementRef = elementRef;

    console.log('IonicApp Start', loader, domRenderer, elementRef);
  }

  openModal() {
    console.log('Opening modal');
    Modal.show(this.loader, this.domRenderer, this.elementRef);
  }
}


export function main() {
  bootstrap(IonicApp).then((appRef) => {
    console.log('Done bootstrapping', appRef);

  })
}

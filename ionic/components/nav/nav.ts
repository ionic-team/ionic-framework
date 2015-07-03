import {Component, Directive, View, ElementRef, Parent, Optional, forwardRef, onInit, Injector} from 'angular2/angular2';

import {IonicComponent} from '../../config/annotations';
import {ViewController} from '../view/view-controller';


@IonicComponent({
  selector: 'ion-nav',
  properties: [
    'root'
  ],
  lifecycle: [onInit]
})
@View({
  template: '<template pane-anchor></template>',
  directives: [forwardRef(() => NavPaneAnchor)]
})
export class Nav extends ViewController {

  constructor(
    @Optional() parentViewCtrl: ViewController,
    injector: Injector,
    elementRef: ElementRef
  ) {
    super(parentViewCtrl, injector, elementRef);
  }

  onInit() {
    if (this.root) {
      this.push(this.root);
    }
  }

}


@Directive({selector: 'template[pane-anchor]'})
class NavPaneAnchor {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    nav.anchorElementRef(elementRef);
  }
}

import {Component, Directive, View, ElementRef, Parent, Optional, Injector, onInit, forwardRef} from 'angular2/angular2';

import {ViewController} from '../view/view-controller';


@Component({
  selector: 'ion-nav',
  properties: [
    'root'
  ],
  lifecycle: [onInit]
})
@View({
  template: '<template pane-anchor></template>',
  directives: [forwardRef(() => PaneAnchor)]
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
    this.push(this.root);
  }

}

@Directive({
  selector: 'template[pane-anchor]'
})
class PaneAnchor {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    nav.anchorElementRef(elementRef);
  }
}

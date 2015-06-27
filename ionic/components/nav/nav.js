import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Optional} from 'angular2/src/di/annotations_impl';
import {Compiler} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

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
  directives: [PaneAnchor]
})
export class Nav extends ViewController {

  constructor(
    @Optional() viewCtrl: ViewController,
    injector: Injector
  ) {
    super(viewCtrl, injector);
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

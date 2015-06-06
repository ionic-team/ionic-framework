import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Optional} from 'angular2/src/di/annotations_impl';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Compiler} from 'angular2/angular2';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';

import {NavBase} from './nav-base';
import {IonicComponent} from '../../config/component';


@Component({
  selector: 'ion-nav',
  properties: [
    'initial'
  ],
  lifecycle: [onInit]
})
@View({
  template: `
    <template pane-anchor></template>
  `,
  directives: [NavPaneAnchor]
})
export class Nav extends NavBase {

  constructor(
    @Optional() parentNavBase: NavBase,
    compiler: Compiler,
    elementRef: ElementRef,
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    super(parentNavBase, compiler, elementRef, loader, injector);

    this.domElement = elementRef.domElement;
    this.config = Nav.config.invoke(this);
  }

  onInit() {
    this.push(this.initial);
  }

}
new IonicComponent(Nav, {});


@Directive({
  selector: 'template[pane-anchor]'
})
class NavPaneAnchor {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    nav.setPaneAnchor(elementRef);
  }
}

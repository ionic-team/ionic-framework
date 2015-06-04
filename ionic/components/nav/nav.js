import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl'
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {Compiler} from 'angular2/angular2';

import {NavController} from './nav-controller';
import {NavItem, NavParams} from './nav-item';
import {Tabs} from '../tabs/tabs';
//import {nav} from './nav-base';
import {SwipeHandle} from './swipe-handle';
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
export class Nav {

  constructor(
      @Optional() parentNavBase: NavBase,
      compiler:Compiler,
      elementRef: ElementRef,
      loader: DynamicComponentLoader,
      injector: Injector
    ) {
    this.navBase = new NavBase(parentNavBase, compiler, elementRef, loader, injector);

    this.domElement = elementRef.domElement;
    this.config = Nav.config.invoke(this);
  }

  onInit() {
    this.navBase.initial(this.initial);
  }

  setPaneAnchor(elementRef) {
    this.navBase.setPaneAnchor(elementRef);
  }

  addPane(pane) {
    this.navBase.addPane(pane);
  }

}
new IonicComponent(Nav, {});


@Directive({
  selector: 'template[pane-anchor]'
})
class NavPaneAnchor {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    nav.navBase.setPaneAnchor(elementRef);
  }
}

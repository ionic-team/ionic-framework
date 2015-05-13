import {Parent, Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {Injector} from 'angular2/di';

import {NavBase} from 'ionic/components/nav/nav-base';
import {NavItem, NavItemDynamicComponent} from 'ionic/components/nav/nav-item';
import {ToolbarContainer} from 'ionic/components/toolbar/toolbar';


@Component({
  selector: 'ion-nav',
  properties: {
    initial: 'initial'
  }
})
@View({
  template: `
  <header class="toolbar-container">
    <header-anchor></header-anchor>
  </header>
  <section class="nav-item-container">
    <content-anchor></content-anchor>
  </section>
  `,
  directives: [HeaderAnchor, ContentAnchor]
})
export class Nav extends NavBase {

  constructor(
    loader: DynamicComponentLoader,
    injector: Injector
  ) {
    super(loader, injector);
  }

}


@Component({
  selector: 'header-anchor'
})
class HeaderAnchor {
  constructor(@Ancestor() nav: Nav, viewContainerRef: ViewContainerRef) {
    nav.headerContainerRef = viewContainerRef;
  }
}


@Component({
  selector: 'content-anchor'
})
class ContentAnchor {
  constructor(@Ancestor() nav: Nav, elementRef: ElementRef) {
    nav.contentElementRef = elementRef;
  }
}

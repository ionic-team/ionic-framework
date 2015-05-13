import {Parent, Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';

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
  <header class="toolbar-container" style="display:none">
    <header-container></header-container>
  </header>
  <section class="nav-item-container">
    <content-container></content-container>
  </section>
  <footer class="toolbar-container" style="display:none">
    <footer-container></footer-container>
  </footer>
  `,
  directives: [HeaderContainer, ContentContainer, FooterContainer]
})
export class Nav extends NavBase {

  constructor(
    loader: DynamicComponentLoader,
    elementRef: ElementRef
  ) {
    super();
    this.loader = loader;
    this.viewManager = loader._viewManager;
    this.elementRef = elementRef;
  }

}


@Component({
  selector: 'header-container'
})
class HeaderContainer {
  constructor(@Ancestor() nav: Nav, elementRef: ElementRef) {
    nav.itemHeader = {
      elementRef: elementRef
    };
  }
}


@Component({
  selector: 'content-container'
})
class ContentContainer {
  constructor(@Ancestor() nav: Nav, elementRef: ElementRef) {
    nav.itemContent = {
      elementRef: elementRef
    };
  }
}


@Component({
  selector: 'footer-container'
})
class FooterContainer {
  constructor(@Ancestor() nav: Nav, elementRef: ElementRef) {
    nav.footerContainer = {
      elementRef: elementRef
    };
  }
}

import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {NavBase} from './nav-base';
import {ToolbarContainer} from '../toolbar/toolbar-container';


@Component({
  selector: 'ion-nav',
  properties: {
    initial: 'initial'
  }
})
@View({
  template: `
    <header class="toolbar-container">
      <template header-anchor></template>
    </header>
    <section class="nav-item-container">
      <template content-anchor></template>
    </section>
  `,
  directives: [HeaderAnchor, ContentAnchor, ToolbarContainer]
})
export class Nav extends NavBase {
  constructor(elementRef: ElementRef, loader: DynamicComponentLoader, injector: Injector) {
    super(loader, injector);
    this.domElement = elementRef.domElement;
  }

  width() {
    return this.domElement.offsetWidth;
  }
}


@Directive({
  selector: '[header-anchor]'
})
class HeaderAnchor {
  constructor(@Ancestor() nav: Nav, viewContainerRef: ViewContainerRef) {
    nav.headerContainerRef = viewContainerRef;
  }
}


@Directive({
  selector: '[content-anchor]'
})
class ContentAnchor {
  constructor(@Ancestor() nav: Nav, elementRef: ElementRef) {
    nav.contentElementRef = elementRef;
  }
}

import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';

import {NavBase} from './nav-base';
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
    <header class="navbar-container">
      <template navbar-anchor></template>
    </header>
    <section class="content-container">
      <template content-anchor></template>
      <swipe-handle></swipe-handle>
    </section>
  `,
  directives: [NavbarAnchor, ContentAnchor, SwipeHandle]
})
export class Nav {
  constructor(elementRef: ElementRef, loader: DynamicComponentLoader, injector: Injector) {
    this.navBase = new NavBase(elementRef, loader, injector);

    this.domElement = elementRef.domElement;
    this.config = Nav.config.invoke(this);
  }

  onInit() {
    if (this.initial) {
      this.navBase.push(this.initial);
    }
  }

  width() {
    return this.domElement.offsetWidth;
  }

  get swipeBackEnabled() {
    let activeItem = this.navBase.getActive();
    if (activeItem) {
      return activeItem.enableBack;
    }
    return false;
  }
}
new IonicComponent(Nav, {});


@Directive({
  selector: '[navbar-anchor]'
})
class NavbarAnchor {
  constructor(@Parent() nav: Nav, viewContainerRef: ViewContainerRef) {
    nav.navBase.navbarContainerRef = viewContainerRef;
  }
}


@Directive({
  selector: '[content-anchor]'
})
class ContentAnchor {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    nav.navBase.contentElementRef = elementRef;
  }
}

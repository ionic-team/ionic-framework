import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {Optional} from 'angular2/src/di/annotations_impl'
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {Compiler} from 'angular2/angular2';

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


@Component({selector:'ion-nav-pane'})
@View({
  template: `
    <template nav-section-anchor></template>
    <section class="content-container">
      <template content-anchor></template>
    </section>
  `,
  directives: [NavPaneSectionAnchor, NavPaneContentAnchor]
})
export class NavPane {
  constructor(@Parent() nav: Nav, viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
    this.sections = {};
    nav.addPane(this);
  }
  addSection(sectionName, instance) {
    this.sections[sectionName] = instance;
  }
}


// Used to dynamically create new sections for a NavPane
// This is simply a reference point to create new sections
// Navbar, toolbar, and tabbar sections would be created next to this
@Directive({
  selector: 'template[nav-section-anchor]'
})
class NavPaneSectionAnchor {
  constructor(@Parent() navPane: NavPane, elementRef: ElementRef) {
    navPane.sectionAnchorElementRef = elementRef;
  }
}


// Where the content of the NavItem goes next to. All NavPanes have content.
// This is simply a reference point to where content goes
@Directive({
  selector: 'template[content-anchor]'
})
class NavPaneContentAnchor {
  constructor(@Parent() navPane: NavPane, viewContainerRef: ViewContainerRef) {
    navPane.contentContainerRef = viewContainerRef;
  }
}


//
@Component({
  selector: 'section',
  hostAttributes: {
    'class': 'navbar-container'
  }
})
@View({
  template: `
    <template section-anchor></template>
  `,
  directives: [NavBarSectionAnchor]
})
export class NavBarSection {
  constructor(@Parent() navPane: NavPane, viewContainerRef: ViewContainerRef, elementRef: ElementRef) {
    this.navPane = navPane;
    navPane.addSection('navbar', this);
  }
}


// Reference point of where the guts of the NavBar should go next to
@Directive({
  selector: 'template[section-anchor]'
})
class NavBarSectionAnchor {
  constructor(@Parent() navBarSection: NavBarSection, viewContainerRef: ViewContainerRef) {
    navBarSection.viewContainerRef = viewContainerRef;
  }
}

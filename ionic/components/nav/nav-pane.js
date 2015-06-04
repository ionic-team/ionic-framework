import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';

import {Nav} from './nav';


@Component({selector:'ion-nav-pane'})
@View({
  template: `
    <template nav-section-anchor></template>
    <section class="content-container">
      <template view-anchor></template>
    </section>
  `,
  directives: [NavPaneSectionAnchor, NavViewAnchor]
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
  selector: 'template[view-anchor]'
})
class NavViewAnchor {
  constructor(@Parent() navPane: NavPane, viewContainerRef: ViewContainerRef) {
    navPane.contentContainerRef = viewContainerRef;
  }
}

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

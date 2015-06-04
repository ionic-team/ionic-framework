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
      <template content-anchor></template>
    </section>
  `,
  directives: [NavPaneSectionAnchor, NavContentAnchor]
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


@Directive({
  selector: 'template[nav-section-anchor]'
})
class NavPaneSectionAnchor {
  constructor(@Parent() navPane: NavPane, elementRef: ElementRef) {
    navPane.sectionAnchorElementRef = elementRef;
  }
}


@Directive({
  selector: 'template[content-anchor]'
})
class NavContentAnchor {
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

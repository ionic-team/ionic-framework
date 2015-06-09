import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';

import {ViewController} from '../view/view-controller';
import {Nav} from './nav';
import {SwipeHandle} from './swipe-handle';


@Component({selector:'ion-pane'})
@View({
  template: `
    <template pane-anchor></template>
    <section class="content-container">
      <template content-anchor></template>
      <div class="swipe-handle"></div>
    </section>
  `,
  directives: [PaneAnchor, PaneContentAnchor, SwipeHandle]
})
export class Pane {
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
  selector: 'template[pane-anchor]'
})
class PaneAnchor {
  constructor(@Parent() pane: Pane, elementRef: ElementRef) {
    pane.sectionAnchorElementRef = elementRef;
  }
}


@Directive({
  selector: 'template[content-anchor]'
})
class PaneContentAnchor {
  constructor(@Parent() pane: Pane, viewContainerRef: ViewContainerRef) {
    pane.contentContainerRef = viewContainerRef;
  }
}

@Component({
  selector: 'section',
  hostAttributes: {
    'class': 'navbar-container'
  }
})
@View({
  template: `<template navbar-anchor></template>`,
  directives: [NavBarAnchor]
})
export class NavBarContainer {}


// Reference point of where individual view navbars will go next to
@Directive({
  selector: 'template[navbar-anchor]'
})
class NavBarAnchor {
  constructor(viewController: ViewController, viewContainerRef: ViewContainerRef) {
    viewController.navbarViewContainer(viewContainerRef);
  }
}

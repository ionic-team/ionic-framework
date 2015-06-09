import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {bind} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {Nav} from './nav';
import {SwipeHandle} from './swipe-handle';


export class PaneController {
  constructor(viewController: ViewController) {
    this.panes = {};
    this.viewController = viewController;
  }

  get(itemStructure, callback) {
    // this gets or creates the Pane which similar nav items live in
    // Nav items with just a navbar/content would all use the same Pane
    // Tabs and view's without a navbar would get a different Panes

    let key = itemStructure.key;
    let viewController = this.viewController;
    let pane = this.panes[key];

    if (pane) {
      // nav pane which the entering component already exists
      callback(pane);

    } else {
      // create a new nav pane
      this.panes[key] = null;

      let injector = viewController.injector.resolveAndCreateChild([
        bind(ViewController).toValue(viewController)
      ]);

      // add a Pane element
      // when the Pane is added, it'll also add its reference to the panes object
      viewController.loader.loadNextToExistingLocation(Pane, this.anchor, injector).then(() => {

        // get the pane reference by name
        pane = this.panes[key];
        let sectionAnchorElementRef = pane && pane.sectionAnchorElementRef;
        if (!sectionAnchorElementRef) {
          return callback();
        }

        let promises = [];
        let sectionsToAdd = [];

        // decide which sections should be added to this Pane, ie: nav bars, footers, etc.
        // add only the sections it needs
        if (itemStructure.navbar) {
          sectionsToAdd.push(NavBarContainer);
        }

        // add the sections which this type of Pane requires
        sectionsToAdd.forEach(SectionClass => {
          // as each section is compiled and added to the Pane
          // the section will add a reference to itself in the Pane's sections object
          promises.push(
            viewController.loader.loadNextToExistingLocation(SectionClass, sectionAnchorElementRef)
          );
        });

        // wait for all of the sections to resolve
        Promise.all(promises).then(() => {
          callback(pane);
        });

      });

    }
  }

  setAnchor(elementRef) {
    this.anchor = elementRef;
  }

  add(pane) {
    for (let np in this.panes) {
      if (this.panes[np] === null) {
        this.panes[np] = pane;
        return;
      }
    }
    this.panes['_n'] = pane;
  }

}

@Component({
  selector:'ion-pane',
  hostAttributes: {
    'class': 'nav nav-ios'
  }
})
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
class Pane {
  constructor(@Parent() nav: Nav, viewContainerRef: ViewContainerRef) {
    this.sections = {};
    nav.panes.add(this);
  }

  addSection(sectionName, instance) {
    this.sections[sectionName] = instance;
  }
}


@Directive({selector: 'template[pane-anchor]'})
class PaneAnchor {
  constructor(@Parent() pane: Pane, elementRef: ElementRef) {
    pane.sectionAnchorElementRef = elementRef;
  }
}


@Directive({selector: 'template[content-anchor]'})
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
class NavBarContainer {}


// Reference point of where individual view navbars will go next to
@Directive({
  selector: 'template[navbar-anchor]'
})
class NavBarAnchor {
  constructor(viewController: ViewController, viewContainerRef: ViewContainerRef) {
    viewController.navbarViewContainer(viewContainerRef);
  }
}

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {bind} from 'angular2/di';

import {ViewController} from '../view/view-controller';
import {SwipeHandle} from './swipe-handle';
import {ModeComponent} from '../../config/component';


export class PaneController {
  constructor(viewCtrl: ViewController) {
    this.panes = {};
    this.viewCtrl = viewCtrl;
  }

  get(itemStructure, callback) {
    // this gets or creates the Pane which similar nav items live in
    // Nav items with just a navbar/content would all use the same Pane
    // Tabs and view's without a navbar would get a different Panes

    let key = itemStructure.key;
    let viewCtrl = this.viewCtrl;
    let pane = this.panes[key];

    if (pane) {
      // nav pane which the entering component already exists
      callback(pane);

    } else {
      // create a new nav pane
      this.panes[key] = null;

      let injector = viewCtrl.injector.resolveAndCreateChild([
        bind(ViewController).toValue(viewCtrl)
      ]);

      // add a Pane element
      // when the Pane is added, it'll also add its reference to the panes object
      viewCtrl.loader.loadNextToExistingLocation(Pane, this.anchor, injector).then(() => {

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
            viewCtrl.loader.loadNextToExistingLocation(SectionClass, sectionAnchorElementRef)
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
  }

}

@ModeComponent({
  selector:'ion-pane',
  classId: 'nav'
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
export class Pane {
  constructor(viewCtrl: ViewController, elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
    viewCtrl.panes.add(this);
  }

  width() {
    return this.domElement.offsetWidth;
  }

  isTransitioning(val) {
    this.domElement.classList[val ? 'add' : 'remove']('transitioning');
  }

  showPane(val) {
    this.domElement.classList[val ? 'add' : 'remove']('show-pane');
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
  constructor(viewCtrl: ViewController, viewContainerRef: ViewContainerRef) {
    viewCtrl.navbarViewContainer(viewContainerRef);
  }
}

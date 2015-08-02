import {Component, Directive, View, ElementRef, Inject, forwardRef, Injector, bind} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {ViewController} from '../view/view-controller';
import {SwipeHandle} from './swipe-handle';
import {IonicComponent} from '../../config/annotations';
import {PaneAnchor, PaneContentAnchor, NavBarContainer} from './anchors';


export class PaneController {
  constructor(viewCtrl: ViewController) {
    this.panes = {};
    this.viewCtrl = viewCtrl;

    this.bindings = Injector.resolve([
      bind(ViewController).toValue(viewCtrl)
    ]);
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


      viewCtrl.loader.loadNextToLocation(Pane, viewCtrl.anchorElementRef(), this.bindings).then(() => {

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
            viewCtrl.loader.loadNextToLocation(SectionClass, sectionAnchorElementRef)
          );
        });

        // wait for all of the sections to resolve
        Promise.all(promises).then(() => {
          callback(pane);
        }, err => {
          console.error(err)
        });

      }, loaderErr => {
        console.error(loaderErr);

      }).catch(err => {
        console.error(err);
      });

    }
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

@IonicComponent({
  selector: 'ion-pane',
  classId: 'nav',
  host: {
    ['[class.show-pane]']: 'showPane'
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
export class Pane extends Ion {
  constructor(
    @Inject(forwardRef(() => ViewController)) viewCtrl: ViewController,
    elementRef: ElementRef,
    ionicConfig: IonicConfig
  ) {
    super(elementRef, ionicConfig);

    viewCtrl.panes.add(this);
  }

  set showPane(val) {
    this._showPane = val;
  }

  get showPane() {
    return this._showPane;
  }
}

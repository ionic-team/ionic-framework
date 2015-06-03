import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {DynamicComponentLoader} from 'angular2/src/core/compiler/dynamic_component_loader';
import {Injector} from 'angular2/di';
import {ViewContainerRef} from 'angular2/src/core/compiler/view_container_ref';
import {Compiler} from 'angular2/angular2';
import {bind} from 'angular2/di';

import {NavController} from './nav-controller';
import {NavItem, NavParams} from './nav-item';
import {Tabs} from '../tabs/tabs';
import {nav} from './nav-base';
import {SwipeHandle} from './swipe-handle';
import {IonicComponent} from '../../config/component';
import * as util from 'ionic/util';
import {Transition, ClickBlock} from 'ionic/ionic';


@Component({
  selector: 'ion-nav',
  properties: [
    'initial'
  ],
  lifecycle: [onInit]
})
@View({
  template: `
    <template nav-pane-anchor></template>
  `,
  directives: [NavPaneAnchor]
})
export class Nav {

  constructor(compiler:Compiler, elementRef: ElementRef, loader: DynamicComponentLoader, injector: Injector, viewContainerRef: ViewContainerRef) {
    this.compiler = compiler;
    this.elementRef = elementRef;
    this.loader = loader;
    this.injector = injector;
    this.viewContainerRef = viewContainerRef;
    this.items = [];
    this.navCtrl = new NavController(this);
    this.sbTransition = null;
    this.sbActive = false;
    this.domElement = elementRef.domElement;
    this.config = Nav.config.invoke(this);

    this.navPanes = {};
  }

  getPane(itemStructure) {
    // this gets or creates the NavPane which similar nav items live in
    // Nav items with just a navbar/content would all use the same NavPane
    // Tabs and view's without a navbar would get a different NavPanes
    let resolve;
    let promise = new Promise((res) => { resolve = res; });

    if (this.navPanes[itemStructure.key]) {
      // nav pane which the entering component already exists
      resolve(this.navPanes[itemStructure.key]);

    } else {
      // create a new nav pane
      this.navPanes[itemStructure.key] = null;

      // add a NavPane element
      // when the NavPane is added, it'll also add its reference to the navPanes object
      this.loader.loadNextToExistingLocation(NavPane, this.anchorElementRef, null).then(() => {

        // get the navPane reference by name
        let navPane = this.navPanes[itemStructure.key];

        // get the element inside the NavPane to add sections to
        let sectionViewContainerRef = navPane.sectionAnchorElementRef;
        let promises = [];
        let sectionsToAdd = []

        // decide which sections should be added to this NavPane, ie: nav bars, tab bars, etc.
        // add only the sections it needs
        if (itemStructure.navbar) {
          sectionsToAdd.push(NavBarSection);
        }

        // add the sections which this type of NavPane requires
        sectionsToAdd.forEach(SectionClass => {
          // as each section is compiled and added to the NavPane
          // the section will add a reference to itself in the NavPane's sections object
          promises.push( this.loader.loadNextToExistingLocation(SectionClass, sectionViewContainerRef, null) );
        });

        // wait for all of the sections to resolve
        Promise.all(promises).then(() => {
          resolve(navPane);
        });

      });

    }

    return promise;
  }

  addPane(navPane) {
    for (let np in this.navPanes) {
      if (this.navPanes[np] === null) {
        this.navPanes[np] = navPane;
      }
    }
  }

  onInit() {
    if (this.initial) {
      this.push(this.initial);
    }
  }

  push(Component, params = {}, opts = {}) {
    if (this.isTransitioning()) {
      return Promise.reject();
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "forward"
    opts.direction = opts.direction || 'forward';

    if(opts.animate === false) {
      opts.animation = 'none';
    }

    // do not animate if this is the first in the stack
    if (!this.items.length) {
      opts.animation = 'none';
    }

    // the active item is going to be the leaving one (if one exists)
    let leavingItem = this.getActive() || new NavItem();
    leavingItem.shouldDestroy = false;
    leavingItem.shouldCache = true;
    leavingItem.willCache();

    // create a new NavStackItem
    let enteringItem = new NavItem(this, Component, params);

    // set that this item is staged (it's not ready to be animated in yet)
    enteringItem.state = STAGED_STATE;

    // add the item to the stack
    this.items.push(enteringItem);

    // start the transition
    this.transition(enteringItem, leavingItem, opts).then(() => {
      resolve();
    });

    return promise;
  }

  pop(opts = {}) {
    if (this.isTransitioning() || this.items.length < 1) {
      return Promise.reject();
    }

    if(opts.animate === false) {
      opts.animation = 'none';
    }

    let resolve;
    let promise = new Promise(res => { resolve = res; });

    // default the direction to "back"
    opts.direction = opts.direction || 'back';

    // get the active item and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingItem = this.getActive() || new NavItem();
    leavingItem.shouldDestroy = true;
    leavingItem.shouldCache = false;
    leavingItem.willUnload();

    // the entering item is now the new last item
    // Note: we might not have an entering item if this is the only
    // item on the history stack.
    let enteringItem = this.getPrevious(leavingItem);
    if(enteringItem) {
      // start the transition
      this.transition(enteringItem, leavingItem, opts).then(() => {
        // transition completed, destroy the leaving item
        resolve();
      });

    } else {
      this.transitionComplete();
      resolve();
    }

    return promise;
  }

  transition(enteringItem, leavingItem, opts) {
    let resolve;
    let promise = new Promise(res => { resolve = res; });

    opts.isAnimated = (opts.animation !== 'none');

    this.transitionStart(opts);

    // wait for the new item to complete setup
    enteringItem.stage().then(() => {

      enteringItem.shouldDestroy = false;
      enteringItem.shouldCache = false;
      enteringItem.willEnter();
      leavingItem.willLeave();

      // set that the leaving item is stage to be leaving
      leavingItem.state = STAGED_LEAVING_STATE;

      // set that the new item pushed on the stack is staged to be entering
      // setting staged state is important for the transition logic to find the correct item
      enteringItem.state = STAGED_ENTERING_STATE;

      // init the transition animation
      let transAnimation = Transition.create(this, opts);

      // wait for the items to be fully staged
      transAnimation.stage().then(() => {

        // update the state that the items are actively entering/leaving
        enteringItem.state = ACTIVELY_ENTERING_STATE;
        leavingItem.state = ACTIVELY_LEAVING_STATE;

        // start the transition
        transAnimation.play().then(() => {

          // transition has completed, update each item's state
          enteringItem.state = ACTIVE_STATE;
          leavingItem.state = CACHED_STATE;

          // dispose any items that shouldn't stay around
          transAnimation.dispose();

          enteringItem.didEnter();
          leavingItem.didLeave();

          // all done!
          this.transitionComplete();

          // resolve that this push has completed
          resolve();
        });

      });

    });

    return promise;
  }

  swipeBackStart() {
    if (this.isTransitioning() || this.items.length < 2) {
      return;
    }

    this.sbActive = true;
    this.sbResolve = null;

    // default the direction to "back"
    let opts = {
      direction: 'back'
    };

    // get the active item and set that it is staged to be leaving
    // was probably the one popped from the stack
    let leavingItem = this.getActive() || new NavItem();
    leavingItem.shouldDestroy = true;
    leavingItem.shouldCache = false;
    leavingItem.willLeave();
    leavingItem.willUnload();

    // the entering item is now the new last item
    let enteringItem = this.getPrevious(leavingItem);
    enteringItem.shouldDestroy = false;
    enteringItem.shouldCache = false;
    enteringItem.willEnter();

    // start the transition
    this.transitionStart({ isAnimated: true });

    // wait for the new item to complete setup
    enteringItem.stage().then(() => {

      // set that the leaving item is stage to be leaving
      leavingItem.state = STAGED_LEAVING_STATE;

      // set that the new item pushed on the stack is staged to be entering
      // setting staged state is important for the transition logic to find the correct item
      enteringItem.state = STAGED_ENTERING_STATE;

      // init the transition animation
      this.sbTransition = Transition.create(this, opts);
      this.sbTransition.easing('linear');

      // wait for the items to be fully staged
      this.sbTransition.stage().then(() => {

        // update the state that the items are actively entering/leaving
        enteringItem.state = ACTIVELY_ENTERING_STATE;
        leavingItem.state = ACTIVELY_LEAVING_STATE;

        let swipeBackPromise = new Promise(res => { this.sbResolve = res; });

        swipeBackPromise.then((completeSwipeBack) => {

          if (completeSwipeBack) {
            // swipe back has completed, update each item's state
            enteringItem.state = ACTIVE_STATE;
            leavingItem.state = CACHED_STATE;

            enteringItem.didEnter();
            leavingItem.didLeave();

          } else {
            // cancelled the swipe back, return items to original state
            leavingItem.state = ACTIVE_STATE;
            enteringItem.state = CACHED_STATE;

            leavingItem.willEnter();
            leavingItem.didEnter();
            enteringItem.didLeave();

            leavingItem.shouldDestroy = false;
            enteringItem.shouldDestroy = false;
          }

          // all done!
          this.transitionComplete();

        });

      });

    });

  }

  swipeBackEnd(completeSwipeBack, progress, playbackRate) {
    // to reverse the animation use a negative playbackRate
    if (this.sbTransition && this.sbActive) {
      this.sbActive = false;

      if (progress <= 0) {
        this.swipeBackProgress(0.0001);
      } else if (progress >= 1) {
        this.swipeBackProgress(0.9999);
      }

      if (!completeSwipeBack) {
        playbackRate = playbackRate * -1;
      }

      this.sbTransition.playbackRate(playbackRate);

      this.sbTransition.play().then(() => {
        this.sbResolve && this.sbResolve(completeSwipeBack);
        this.sbTransition && this.sbTransition.dispose();
        this.sbResolve = this.sbTransition = null;
      });
    }
  }

  swipeBackProgress(progress) {
    if (this.sbTransition) {
      ClickBlock(true, 4000);
      this.sbTransition.progress( Math.min(1, Math.max(0, progress)) );
    }
  }

  transitionStart(opts) {
    if (opts.isAnimated) {
      // block possible clicks during transition
      ClickBlock(true, 520);
      this.getNavElement().classList.add('transitioning');
    }
  }

  transitionComplete() {

    this.items.forEach((item) => {
      if (item) {
        if (item.shouldDestroy) {
          this.remove(item);
          item.destroy();

        } else if (item.state === CACHED_STATE && item.shouldCache) {
          item.cache();
          item.shouldCache = false;
        }
      }
    });

    this.getNavElement().classList.remove('transitioning');

    // allow clicks again
    ClickBlock(false);
  }

  isTransitioning() {
    let state;
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      state = this.items[i].state;
      if (state === ACTIVELY_ENTERING_STATE ||
          state === ACTIVELY_LEAVING_STATE ||
          state === STAGED_ENTERING_STATE ||
          state === STAGED_LEAVING_STATE) {
        return true;
      }
    }
    return false;
  }

  clear() {
    let pops = [];
    for(let item of this.items) {
      pops.push(this.pop({
        animate: false
      }));
    }
    return Promise.all(pops);
  }

  getActive() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === ACTIVE_STATE) {
        return this.items[i];
      }
    }
    return null;
  }

  getPrevious(item) {
    if (item) {
      return this.items[ this.items.indexOf(item) - 1 ];
    }
    return null;
  }

  getStagedEnteringItem() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === STAGED_ENTERING_STATE) {
        return this.items[i];
      }
    }
    return null;
  }

  getStagedLeavingItem() {
    for (let i = 0, ii = this.items.length; i < ii; i++) {
      if (this.items[i].state === STAGED_LEAVING_STATE) {
        return this.items[i];
      }
    }
    return null;
  }

  getNavElement() {
    return this.domElement;
  }

  remove(itemOrIndex) {
    util.array.remove(this.items, itemOrIndex);
  }

  width() {
    return this.domElement.offsetWidth;
  }

  get swipeBackEnabled() {
    // let activeItem = this.nav.getActive();
    // if (activeItem) {
    //   return activeItem.enableBack;
    // }
    return false;
  }
}
new IonicComponent(Nav, {});


// Used to dynamically place new NavPanes next to this
// Which is inside of ion-nav
@Directive({
  selector: 'template[nav-pane-anchor]'
})
class NavPaneAnchor {
  constructor(@Parent() nav: Nav, elementRef: ElementRef) {
    nav.anchorElementRef = elementRef;
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



@Component({selector:'ion-tab-pane'})
@View({
  template: `
    <div class="navbar-container">
      <template navbar-anchor></template>
    </div>
    <div class="tabbar-container">
      <template tabbar-anchor></template>
    </div>
    <template content-anchor></template>
  `,
  directives: [TabPaneContentAnchor, TabPaneSectionAnchor]
})
export class TabPane extends NavPane {
  constructor(@Parent() nav: Nav, viewContainerRef: ViewContainerRef) {
    super(nav, viewContainerRef);
  }
}


@Directive({
  selector: 'template[content-anchor]'
})
class TabPaneContentAnchor {
  constructor(@Parent() tabPane: TabPane, viewContainerRef: ViewContainerRef) {
    tabPane.contentContainerRef = viewContainerRef;
  }
}


// Used to dynamically create new sections for a NavPane
// This is simply a reference point to create new sections
// Navbar, toolbar, and tabbar sections would be created next to this
@Directive({
  selector: 'template[section-anchor]'
})
class TabSectionAnchor {
  constructor(@Parent() tabPane: TabPane, elementRef: ElementRef) {
    tabPane.sectionAnchorElementRef = elementRef;
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
class NavBarSection {
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


const STAGED_STATE = 'staged';
const STAGED_ENTERING_STATE = 'staged-enter';
const STAGED_LEAVING_STATE = 'staged-leave';
const ACTIVELY_ENTERING_STATE = 'entering';
const ACTIVELY_LEAVING_STATE = 'leaving';
const ACTIVE_STATE = 'active';
const CACHED_STATE = 'cached';

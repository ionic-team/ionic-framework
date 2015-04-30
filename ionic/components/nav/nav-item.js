import {
  Component,
  DynamicComponent,
  Decorator,
  Ancestor,
  NgElement,
  DynamicComponentLoader,
  ElementRef,
  Query,
  View as NgView,
} from 'angular2/angular2';

import {
  Injectable,
  bind,
  Optional,
} from 'angular2/di';

import {Toolbar} from 'ionic/components/toolbar/toolbar';
import {NavInjectable} from 'ionic/components/nav/nav';
import * as util from 'ionic/util';

/*
 * NavController is the public interface for pushing, popping, etc that is injected
 * by users.
 * Each nav item exposes a new NavController.
 */
export class NavController {
  constructor() {
    // Contains data passed to this NavController's NavItem
    this.params = {};
    // this.navItem and this.nav are set by NavItem below.
  }

  addToolbar(placement: String, toolbar: Toolbar) {
    if (!this.navItem._toolbars[placement]) {
      return console.error(
        `Toolbar must have a placement of top or bottom, found toolbar ${toolbar} with placement ${placement}!`
      );
    }
    this.navItem._toolbars[placement].push(toolbar);
  }

  removeToolbar(placement: String, toolbar: Toolbar) {
    let bars = this.navItem._toolbars[placement];
    bars && util.array.remove(bars, toolbar);
  }

  push() {
    return this.nav.push.apply(this.nav, arguments);
  }
  pop() {
    return this.nav.pop.apply(this.nav, arguments);
  }
}

@Component({
  selector: '.nav-item',
  properties: {
    _item: 'item'
  },
  injectables: [
    // Allow all descendants to inject NavController and do nav operations.
    NavController
  ]
})
@NgView({
  // See below for this.
  template: '<div class="nav-item-child"></div>',
  directives: [NavItemDynamicComponent]
})
export class NavItem {
  constructor(
    // TODO for now, we can't inject tab as if it's a Nav
    navInjectable: NavInjectable,
    navCtrl: NavController,
    element: NgElement
  ) {
    this.domElement = element.domElement;
    this._toolbars = {
      top: [],
      bottom: []
    };
    this.navCtrl = navCtrl;
    navCtrl.nav = navInjectable.nav;
    navCtrl.navItem = this;
  }

  set _item(data) {
    var navChild = this.dynamicComponentChild;

    if (this.initialized) return;
    this.initialized = true;

    this.Class = data.Class;

    util.extend(this.navCtrl.params, data.params || {});

    navChild._loader.loadIntoExistingLocation(this.Class, navChild._elementRef).then((instance) => {
      this.instance = instance;
      data.finishSetup(this, instance);
    });
  }
}

/**
 * In angular 2.0.0-alpha.21, DynamicComponents are not allowed to publish injectables
 * (bug, see https://github.com/angular/angular/issues/1596).
 * To fix this problem, we have the `NavItem` above publish a `NavController ` injectable
 * so the rest of the app has access to nav operations. Then we have a DynamicComponent
 * instantiate the user's page.
 * The `NavItem` class above can be turned into a DynamicComponent and this class can be removed
 * once injectables are allowed on regular Components.
 */
@DynamicComponent({
  selector: '.nav-item-child',
  properties: {
    _item: 'item'
  }
})
export class NavItemDynamicComponent {
  constructor(
    loader: DynamicComponentLoader,
    elementRef: ElementRef,
    @Ancestor() navItem: NavItem

  ) {
    this._loader = loader;
    this._elementRef = elementRef;
    navItem.dynamicComponentChild = this;
  }
}

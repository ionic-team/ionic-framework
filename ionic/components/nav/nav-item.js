import {
  DynamicComponent,
  Parent,
  NgElement,
  DynamicComponentLoader,
  ElementRef,
} from 'angular2/angular2';
import {
  Injectable,
  bind,
  Optional,
} from 'angular2/di';
import {Nav} from 'ionic/components/nav/nav'
import {Tab} from 'ionic/components/tabs/tab'
import * as util from 'ionic/util';

@DynamicComponent({
  selector: 'ion-nav-item',
  properties: {
    _item: 'item'
  }
})
export class NavItem {
  constructor(
    @NgElement() element: NgElement,
    loader: DynamicComponentLoader,
    elementRef: ElementRef

    // FIXME: this is temporary until ng2 lets us inject tabs as a Nav
    // @Optional() @Parent() viewportNav: Nav,
    // @Optional() @Parent() viewportTab: Tab
  ) {
    this._loader = loader;
    this._elementRef = elementRef;
    // this.viewport = viewportTab || viewportNav;
    this.domElement = element.domElement;
    this.params = {};
  }

  set _item(data) {
    if (this.initialized) return;
    this.initialized = true;
    this.Class = data.Class;
    this._item = data;

    util.extend(this.params, data.params);

    this._loader.loadIntoExistingLocation(data.Class, this._elementRef).then(instance => {
      this.instance = instance
      data.finishSetup(this, instance)
    })
  }

  // /**
  //  * Push out of this view into another view
  //  */
  // push(Class: Function, opts = {}) {
  //   return this.viewport.push(Class, opts)
  // }

  // /**
  //  * Go back
  //  */
  // pop(opts) {
  //   return this.viewport.pop(opts)
  // }

  // popTo(index, opts) {
  //   return this.viewport.popTo(index, opts)
  // }
}

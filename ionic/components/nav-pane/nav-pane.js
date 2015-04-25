import {DynamicComponent, Parent, NgElement, DynamicComponentLocation, DynamicComponentLoader, Optional} from 'angular2/angular2'
import {NavViewport} from 'ionic/components/nav-viewport/nav-viewport'
import {Tab} from 'ionic/components/tabs/tab'

@DynamicComponent({
  selector: '.nav-pane',
  bind: {
    item: 'item'
  }
})
export class NavPane {
  constructor(
    loader: DynamicComponentLoader,
    location: DynamicComponentLocation,
    @NgElement() element: NgElement,

    // FIXME: this is temporary until ng2 lets us inject tabs as a NavViewport
    @Optional() @Parent() viewportNav: NavViewport,
    @Optional() @Parent() viewportTab: Tab
  ) {
    this._loader = loader
    this._location = location
    this.viewport = viewportTab || viewportNav
    this.domElement = element.domElement
  }

  set item(navItem) {
    if (this.initialized) return;
    this.initialized = true;
    this.Class = navItem.Class;

    this._loader.load(navItem.Class, this._location).then(instance => {
      this.instance = instance
      navItem.finishSetup(this, instance)
    })
  }

  /**
   * Push out of this view into another view
   */
  push(Class: Function, opts = {}) {
    return this.viewport.push(Class, opts)
  }

  /**
   * Go back
   */
  pop(opts) {
    return this.viewport.pop(opts)
  }

  popTo(index, opts) {
    return this.viewport.popTo(index, opts)
  }
}

import {DynamicComponent, Ancestor, NgElement} from 'angular2/angular2'
import {Optional} from 'angular2/src/di/annotations'
import {NavViewport} from 'ionic2/components/nav-viewport/nav-viewport'
import {Tabs} from 'ionic2/components/tabs/tabs'
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader'
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location'

@DynamicComponent({
  selector: '.nav-view',
  bind: {
    item: 'item'
  }
})
export class NavView {
  constructor(
    loader: PrivateComponentLoader,
    location: PrivateComponentLocation,
    @NgElement() element: NgElement,

    // FIXME: this is temporary until ng2 lets us inject tabs as a NavViewport
    @Optional() @Ancestor() viewportNav: NavViewport,
    @Optional() @Ancestor() viewportTabs: Tabs
  ) {
    this.loader = loader
    this.location = location
    this.viewport = viewportTabs || viewportNav
    this.domElement = element.domElement
  }

  set item(navItem) {
    this.loader.load(navItem.Class, this.location).then(instance => {
      navItem.finishSetup(this, instance)
    })
  }
}

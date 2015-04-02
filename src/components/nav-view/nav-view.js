import {DynamicComponent, Parent, NgElement} from 'angular2/angular2'
import {NavViewport} from 'ionic2/components'
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
    @Parent() viewport: NavViewport,
    @NgElement() element: NgElement
  ) {
    this.loader = loader
    this.location = location
    this.viewport = viewport
    this.domElement = element.domElement
  }

  set item(navItem) {
    this.loader.load(navItem.Class, this.location).then(instance => {
      navItem.finishSetup(this, instance)
    })
  }
}

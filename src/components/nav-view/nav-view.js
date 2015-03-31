import {Component, Template, NgElement} from 'angular2/angular2'
import {ComponentConfig} from 'ionic2/config/component-config'
import {Log} from 'ionic2/util'

import {Compiler} from 'angular2/src/core/compiler/compiler'
import {EventManager} from 'angular2/src/core/events/event_manager'
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location'
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader'
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader'
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy'

@Component({
  selector: 'ion-nav',
  bind: {
    initial: 'initial'
  },
  services: []
})
@Template({
  inline: `<content></content>`
})
export class NavView {
  constructor(
    @NgElement() element: NgElement,
    eventManager: EventManager,
    compiler: Compiler,
    location: PrivateComponentLocation,
    loader: PrivateComponentLoader,
    directiveMetadataReader: DirectiveMetadataReader,
    shadowDomStrategy: ShadowDomStrategy
  ) {
    this.attacher = new Attacher({
      compiler,
      element,
      location, 
      loader,
      directiveMetadataReader,
      eventManager,
      shadowDomStrategy
    })

    this._children = []
    console.log('Nav View constructed')
  }

  set initial(Type) {
    if (!this.initialized) {
      this.initialized = true
      this.push(Type)
    }
  }

  /**
   * Push a new view into the history stack.
   *
   * @param view the new view
   * @param shouldAnimate whether to animate
   */
  push(Type, shouldAnimate) {
    //TODO animation

    let current = this._children[this._children.length - 1]
    current && current.hide()

    this.attacher.attachComponent(Type).then(child => {
      this._children.push(child)
    })
    Log.log('NAV: PUSH', Type.name, 'Animate?', shouldAnimate)
  }

  /**
   * Pop a view off the history
   *
   * @param shouldAnimate whether to animate
   */
  pop(shouldAnimate) {
    // TODO animation
    let current = this._children.pop()
    if (current) {
      current.remove()
    }
    let last = this._children[this._children.length - 1]
    if (last) {
      last.show()
    }
    return last
  }

  get views() {
    return this._views
  }
  /**
   * Set the view stack explicitly.
   */
  set views(v) {
    this._views = v
  }

  // Animate a new view *in*
  _animateIn(view) {

  }

  // Animate an old view *out*
  _animateOut(view) {
  }

}

class Attacher {
  constructor({
    location,
    element,
    directiveMetadataReader,
    compiler,
    shadowDomStrategy,
    eventManager
  }) {
    this.location = location
    this.element = element
    this.directiveMetadataReader = directiveMetadataReader
    this.compiler = compiler
    this.shadowDomStrategy = shadowDomStrategy
    this.eventManager = eventManager
  }

  attachComponent(Type) {
    let parentInjector = this.location._elementInjector
    let childInjector = parentInjector._proto.instantiate(
      /* parent */ parentInjector,
      /* host */ null
    )

    let childContainer = document.createElement('div')
    childContainer.classList.add('test-child-container')
    this.element.domElement.appendChild(childContainer)

    let childNgElement = new NgElement(childContainer)
    childInjector._preBuiltObjects = parentInjector._preBuiltObjects
    childInjector._preBuiltObjects.element = childNgElement

    let annotation = this.directiveMetadataReader.read(Type).annotation
    return this.compiler.compile(Type).then((protoView) => {
      let context = childInjector.createPrivateComponent(Type, annotation);
      let view = protoView.instantiate(childInjector, this.eventManager)

      view.hydrate(parentInjector.getShadowDomAppInjector(), childInjector, null, context, null)
      this.shadowDomStrategy.attachTemplate(childNgElement.domElement, view)

      this.location._view.componentChildViews.push(view)
      this.location._view.changeDetector.addChild(view.changeDetector)

      return {
        remove() {
          // TODO actually remove it from the angular tree
          // setTimeout(() => { view.dehydrate() })
          childContainer.parentNode.removeChild(childContainer)
        },
        hide() {
          // view.dehydrate()
          childContainer.style.display = 'none'
        },
        show() {
          childContainer.style.display = ''
          // view.hydrate()
        },
      }
    })
  }

}

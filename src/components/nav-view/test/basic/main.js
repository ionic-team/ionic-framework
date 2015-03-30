import {bootstrap} from 'angular2/core'
import {Component, Template, NgElement, Parent} from 'angular2/angular2'
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver'
import {Compiler} from 'angular2/src/core/compiler/compiler'
import {EventManager} from 'angular2/src/core/events/event_manager'
import {NavView} from 'ionic2/components/nav-view/nav-view'
import {View} from 'ionic2/components/view/view'
import {Log} from 'ionic2/util'
import {PrivateComponentLocation} from 'angular2/src/core/compiler/private_component_location'
import {PrivateComponentLoader} from 'angular2/src/core/compiler/private_component_loader'
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader'
import {ShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy'

@Component({
  selector: 'my-page'
})
@Template({
  inline: '<div>Hello, inside page {{num}}</div>'
})
export class InsidePage {
  constructor(
    ele: NgElement,
    @Parent() myPage: MyPage
  ) {
    console.log(myPage)
    this.num = Math.random()
    ele.domElement.style.backgroundColor = `rgba(255,0,0,${this.num})`
  }
}

@Component({
  selector: 'my-page',
  services: [Compiler, PrivateComponentLocation]
})
@Template({
  inline: `<div><h2>I'm a page!</h2>
    <button class="button" (click)="push()">Push</button>
    <button class="button" (click)="pop()">Pop</button>
  </div>`
})
export class MyPage {
  constructor(
    @NgElement() ele:NgElement,
    eventManager: EventManager,
    compiler: Compiler,
    location: PrivateComponentLocation,
    loader: PrivateComponentLoader,
    reader: DirectiveMetadataReader,
    shadowDomStrategy: ShadowDomStrategy
  ) {
    this.ele = ele
    this.location = location
    this.loader = loader
    this.reader = reader
    this.compiler = compiler
    this.eventManager = eventManager
    this.shadowDomStrategy = shadowDomStrategy

    this._children = []
  }
  push() {
    let childInjector = this.location._elementInjector._proto.instantiate(
      /* parent */ this.location._elementInjector,
      /* host */ null
    )

    let childContainer = document.createElement('div')
    childContainer.classList.add('test-child-container')
    this.ele.domElement.appendChild(childContainer)

    let childNgElement = new NgElement(childContainer)
    childInjector._preBuiltObjects = this.location._elementInjector._preBuiltObjects
    childInjector._preBuiltObjects.element = childNgElement

    let annotation = this.reader.read(InsidePage).annotation
    this.compiler.compile(InsidePage).then((protoView) => {
      let context = childInjector.createPrivateComponent(InsidePage, annotation);
      let view = protoView.instantiate(childInjector, this.eventManager)

      view.hydrate(childInjector.getShadowDomAppInjector(), childInjector, null, context, null)
      this.shadowDomStrategy.attachTemplate(childNgElement.domElement, view)

      this.location._view.componentChildViews.push(view)
      this.location._view.changeDetector.addChild(view.changeDetector)

      this._children.push({
        remove() {
          view.dehydrate()
          childContainer.parentNode.removeChild(childContainer)
        }
      })
    })
  }
  pop() {
    var last = this._children.pop()
    if (!last) return;

    last.remove()
  }

}

@Component({ selector: '[ion-app]' })
@Template({
  directives: [NavView, View, MyPage],
  url: 'main.html'
})
class IonicApp {
  constructor() {
    console.log('IonicApp Start')
  }
}

bootstrap(IonicApp)

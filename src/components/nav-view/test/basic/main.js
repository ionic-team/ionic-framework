import {bootstrap} from 'angular2/core'
import {Component, Template, NgElement, Parent} from 'angular2/angular2'
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver'
import {Compiler} from 'angular2/src/core/compiler/compiler'
import {ElementInjector} from 'angular2/src/core/compiler/element_injector'
import {EventManager} from 'angular2/src/core/events/event_manager'
import {NavView} from 'ionic2/components/nav-view/nav-view'
import {View} from 'ionic2/components/view/view'
import {Log} from 'ionic2/util'

@Component({
  selector: 'my-page'
})
@Template({
  inline: 'Hello, inside page!'
})
export class InsidePage {
}

@Component({
  selector: 'my-page',
  services: [TemplateResolver, Compiler]
})
@Template({
  inline: "<div><h2>I'm a page!</h2><content></content></div>"
})
export class MyPage extends View {
  constructor(
    @NgElement() ele:NgElement,
    compiler: Compiler,
    hostElementInjector: ElementInjector,
    eventManager: EventManager
  ) {
    super(ele)
    compiler.compile(InsidePage).then(function(protoView) {
      debugger;
    })
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

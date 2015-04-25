import {bootstrap} from 'angular2/core';
import {Component, Decorator, Template, NgElement} from 'angular2/angular2';
import {Transition, IOSTransition} from 'ionic2/ionic2';



@Component({ selector: '[ion-app]' })
@Template({
  url: 'main.html'
})
class IonicApp {
  constructor(
    @NgElement ngElement:NgElement
  ) {

    this.trans = new Transition( ngElement.domElement.querySelector('.square') )

    this.trans.duration(500)
    this.trans.easing('linear')

    this.trans.property('opacity', 0)

  }

  start() {
    this.trans.start()
  }

  stop() {
    this.trans.stop()
  }
}


bootstrap(IonicApp)

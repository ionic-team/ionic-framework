import {Component, Decorator, View as NgView, NgElement, bootstrap} from 'angular2/angular2';
import {Animation} from 'ionic/ionic';



@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor(
    @NgElement ngElement:NgElement
  ) {

    this.trans = new Animation( ngElement.domElement.querySelector('.square') )

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

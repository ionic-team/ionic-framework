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

    this.animation = new Animation();
    this.animation.elements( ngElement.domElement.querySelectorAll('.square') );

    this.animation.duration(500)
    this.animation.easing('linear')

    this.animation.property('opacity', 0)

  }

  start() {
    let q = this.animation.start();

    q.then(()=> {
      console.log('animation complete')
    });


  }

  stop() {
    this.animation.stop()
  }

  velocityStart() {
    Velocity(document.querySelectorAll('.square'), { opacity: 0 }, 500); // Velocity
  }

}


bootstrap(IonicApp)

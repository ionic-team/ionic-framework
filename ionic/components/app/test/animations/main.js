import {Component, Decorator, View as NgView, NgElement, bootstrap} from 'angular2/angular2';
import {Animation} from 'ionic/ionic';



@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {

    this.animation = new Animation();
    this.animation.elements( document.querySelectorAll('.square') );
    this.animation.debug(2);

    this.animation.duration(500);
    this.animation.easing('swing');

    this.animation.property('opacity', 0);

  }

  start() {
    let q = this.animation.start();

    q.then(()=> {
      console.log('animation complete')
    });
  }

  percent(ev) {
    let ratio = parseFloat(ev.srcElement.value) / 100;
    console.log('percent ratio', ratio);

    this.animation.percent(ratio);
  }

  stop() {
    this.animation.stop();
  }

  velocityStart() {
    Velocity(document.querySelectorAll('.square'), { opacity: 0 }, 500);
  }

}


bootstrap(IonicApp)

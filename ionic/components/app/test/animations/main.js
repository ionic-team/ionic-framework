import {Component, Decorator, View as NgView, NgElement, bootstrap} from 'angular2/angular2';
import {Animation} from 'ionic/ionic';



@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {


  }

  fadeOut() {
    let animation = new Animation();
    animation.elements( document.querySelectorAll('.square') );
    animation.debug(2);

    animation.duration(500);
    animation.easing('swing');

    animation.property('opacity', 0);

    let q = animation.start();

    q.then(()=> {
      console.log('fade out complete')
    });
  }

  fadeIn() {
    let animation = new Animation();
    animation.elements( document.querySelectorAll('.square') );
    animation.debug(2);

    animation.duration(500);
    animation.easing('swing');

    animation.property('opacity', 1);

    let q = animation.start();

    q.then(()=> {
      console.log('fade in complete')
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
    window.Velocity(document.querySelectorAll('.square'), { opacity: 0 }, 500);
  }

}


bootstrap(IonicApp)

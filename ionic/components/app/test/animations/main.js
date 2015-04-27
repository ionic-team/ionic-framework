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
    this.animation = new Animation();
    this.animation.elements( document.querySelectorAll('.square') );

    this.animation.duration(2000);
    this.animation.easing('swing');

    this.animation.property('opacity', 0.2);
    this.animation.property('translateX', '100px');
    this.animation.property('translateY', '100px');
    this.animation.property('rotateZ', '180deg');
    this.animation.property('scale', '0.5');

    let q = this.animation.start();

    q.then(()=> {
      console.log('fade out complete')
    });
  }

  fadeIn() {
    this.animation = new Animation();
    this.animation.elements( document.querySelectorAll('.square') );

    this.animation.duration(2000);
    this.animation.easing('swing');

    this.animation.property('opacity', 1);
    this.animation.property('translateX', '0px');
    this.animation.property('translateY', '0px');
    this.animation.property('rotateZ', '0deg');
    this.animation.property('scale', '1');

    let q = this.animation.start();

    q.then(()=> {
      console.log('fade in complete')
    });
  }

  stop() {
    this.animation.stop();
  }

  percent(ev) {
    let ratio = parseFloat(ev.srcElement.value) / 100;
    console.log('percent ratio', ratio);

    this.animation = new Animation();
    this.animation.elements( document.querySelectorAll('.square') );

    this.animation.duration(2000);
    this.animation.easing('swing');

    this.animation.property('opacity', 0.2);
    this.animation.property('translateX', '100px');
    this.animation.property('translateY', '100px');
    this.animation.property('rotateZ', '180deg');
    this.animation.property('scale', '0.5');

    this.animation.percent(ratio);
  }

  stop() {
    this.animation.stop();
  }

  velocityStart() {
    var elements = document.querySelectorAll('.square');
    Velocity(elements, {
      opacity: 0,
      translateX: '100px',
      rotateZ: '90deg'
    }, 2000);

    // setTimeout(function() {
    //   Velocity(elements, "stop");
    // }, 1000)
  }

}


bootstrap(IonicApp)

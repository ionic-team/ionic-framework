import {Component, Decorator, View as NgView, NgElement, bootstrap} from 'angular2/angular2';
import {Animation} from 'ionic/ionic';

let opacity = 0.2;
let rotateZ = '180deg';
let translateX = '100px';
let scale = 0.6;

@Component({ selector: '[ion-app]' })
@NgView({
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {

  }

  fadeOut() {
    console.debug('fadeOut');
    this.animation = new Animation();
    this.animation.elements( document.querySelectorAll('.square') );

    this.animation.duration(1000);
    this.animation.easing('linear');

    this.animation.property('opacity', opacity);
    this.animation.property('translateX', translateX);
    this.animation.property('translateY', translateX);
    this.animation.property('rotateZ', rotateZ);
    this.animation.property('scale', scale);


    let q = this.animation.start();

    q.then(()=> {
      console.log('fade out complete')
    });
  }

  fadeIn() {
    console.debug('fadeIn');
    this.animation = new Animation();
    this.animation.elements( document.querySelectorAll('.square') );

    this.animation.duration(1000);
    this.animation.easing('linear');

    this.animation.property('opacity', 1);
    this.animation.property('translateX', 0);
    this.animation.property('translateY', 0);
    this.animation.property('rotateZ', 0);
    this.animation.property('scale', 1);

    let q = this.animation.start();

    q.then(()=> {
      console.log('fade in complete')
    });
  }

  stop() {
    this.animation.stop();
  }

  percent(ev) {
    let percentComplete = parseFloat(ev.srcElement.value) / 100;

    if (!this.percentAnimation) {
      this.percentAnimation = new Animation();
      this.percentAnimation.elements( document.querySelectorAll('.square') );

      this.percentAnimation.property('opacity', opacity);
      this.percentAnimation.property('translateX', translateX);
      this.percentAnimation.property('translateY', translateX);
      this.percentAnimation.property('rotateZ', rotateZ);
      this.percentAnimation.property('scale', scale);

      this.percentAnimation.ready();
    }

    this.percentAnimation.percent(percentComplete);
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

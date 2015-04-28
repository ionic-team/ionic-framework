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

  fadeOut() {
    console.debug('fadeOut');

    var animation = new Animation();

    animation.duration(1000);
    animation.easing('linear');


    var row1 = new Animation();
    row1.elements( document.querySelectorAll('.square') );

    row1.property('opacity', opacity)
        .property('translateX', translateX)
        .property('translateY', translateX)
        .property('rotateZ', rotateZ)
        .property('scale', scale);

    animation.addChild(row1);


    var row2 = new Animation();
    row2.elements( document.querySelectorAll('.square2') );

    row2.property('opacity', opacity);
    row2.property('translateX', '-100px');
    row2.property('translateY', '-100px');
    row2.property('rotateZ', '-180deg');
    row2.property('scale', 0.4);

    animation.addChild(row2);



    let q = animation.start();

    q.then(()=> {
      console.log('fade out complete')
    });
  }

  fadeIn() {
    console.debug('fadeIn');

    var animation = new Animation();
    animation.elements();

    animation.duration(1000);
    animation.easing('linear');


    var row1 = new Animation();
    row1.elements( document.querySelectorAll('.square') );

    row1.property('opacity', 1);
    row1.property('translateX', 0);
    row1.property('translateY', 0);
    row1.property('rotateZ', 0);
    row1.property('scale', 1);

    animation.addChild(row1);


    var row2 = new Animation();
    row2.elements( document.querySelectorAll('.square2') );

    row2.property('opacity', 1);
    row2.property('translateX', 0);
    row2.property('translateY', 0);
    row2.property('rotateZ', 0);
    row2.property('scale', 1);

    animation.addChild(row2);

    let q = animation.start();

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

      var row1 = new Animation();
      row1.elements( document.querySelectorAll('.square') );

      row1.property('opacity', 1);
      row1.property('translateX', 0);
      row1.property('translateY', 0);
      row1.property('rotateZ', 0);
      row1.property('scale', 1);

      this.percentAnimation.addChild(row1);


      var row2 = new Animation();
      row2.elements( document.querySelectorAll('.square2') );

      row2.property('opacity', 1);
      row2.property('translateX', 0);
      row2.property('translateY', 0);
      row2.property('rotateZ', 0);
      row2.property('scale', 1);

      this.percentAnimation.addChild(row2);


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

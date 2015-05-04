import {Component, Decorator, View, NgElement, bootstrap} from 'angular2/angular2';
import {Animation} from 'ionic/ionic';

let opacity = 0.2;
let rotateZ = '180deg';
let translateX = '100px';
let scale = 0.6;

@Component({ selector: '[ion-app]' })
@View({
  templateUrl: 'main.html'
})
class IonicApp {

  fadeOut() {
    console.debug('fadeOut');

    var animation = new Animation();

    animation.duration(1000);
    animation.easing('linear');

    var row1 = new Animation();
    row1.elements( document.querySelectorAll('.square') )
        .to('opacity', opacity)
        .to('translateX', translateX)
        .to('translateY', translateX)
        .to('rotateZ', rotateZ)
        .to('scale', scale);

    animation.addChild(row1);


    var row2 = new Animation();
    row2.elements( document.querySelectorAll('.square2') );

    row2.to('opacity', opacity);
    row2.to('translateX', '-100px');
    row2.to('translateY', '-100px');
    row2.to('rotateZ', '-180deg');
    row2.to('scale', 0.4);

    animation.addChild(row2);

    let q = animation.start();

    q.then(()=> {
      console.log('fade out complete')
    });
  }


  fadeIn() {
    console.debug('fadeIn');

    var animation = new Animation();

    animation.duration(1000);
    animation.easing('linear');


    var row1 = new Animation();
    row1.elements( document.querySelectorAll('.square') );

    row1.to('opacity', 1);
    row1.to('translateX', 0);
    row1.to('translateY', 0);
    row1.to('rotateZ', 0);
    row1.to('scale', 1);

    animation.addChild(row1);


    var row2 = new Animation();
    row2.elements( document.querySelectorAll('.square2') );

    row2.to('opacity', 1);
    row2.to('translateX', 0);
    row2.to('translateY', 0);
    row2.to('rotateZ', 0);
    row2.to('scale', 1);

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
      // this.percentAnimation.name = 'top';

      var row1 = new Animation();
      row1.elements( document.querySelectorAll('.square') )
          .to('opacity', opacity)
          .to('translateX', translateX)
          .to('translateY', translateX)
          .to('rotateZ', rotateZ)
          .to('scale', scale);

      this.percentAnimation.addChild(row1);

      var row2 = new Animation();
      row2.elements( document.querySelectorAll('.square2') );

      row2.to('opacity', opacity);
      row2.to('translateX', '-100px');
      row2.to('translateY', '-100px');
      row2.to('rotateZ', '-180deg');
      row2.to('scale', 0.4);

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
    // }, 1000);
  }

}


bootstrap(IonicApp)

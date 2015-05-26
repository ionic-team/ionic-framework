import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Animation} from 'ionic/ionic';

let opacity = 0.2;
let rotateZ = '180deg';
let translateX = '100px';
let scale = 0.6;

@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html'
})
class IonicApp {

  constructor() {
    this.animation = new Animation();

    this.animation
      .duration(2000)
      .easing('spring', { damping: 6, elasticity: 10 });


    var ball = new Animation( document.querySelector('.ball') );
    ball
      .from('translateX', '0px')
      .to('translateX', '250px')

    this.animation.addChild(ball);


    var row1 = new Animation( document.querySelectorAll('.square') );
    row1
      .from('opacity', 0.8)
      .to('opacity', 0.2)

    this.animation.addChild(row1);

    var row2 = new Animation( document.querySelectorAll('.square2') );
    row2
      .from('rotate', '0deg')
      .from('scale', '1')
      .to('rotate', '90deg')
      .to('scale', '0.5')
      .beforePlay.addClass('added-before-play')
      .afterFinish.addClass('added-after-finish')

    this.animation.children(row1, row2);

    this.animation.onReady = () => {
      console.log('onReady');
    }

    this.animation.onFinish = () => {
      console.log('onFinish');
    }

  }

  play() {
    this.animation.play();
  }

  pause() {
    this.animation.pause();
  }

  progress(ev) {
    this.animation.progress( parseFloat(ev.srcElement.value) );
  }

}


export function main() {
  bootstrap(IonicApp);
}

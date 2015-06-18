import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Animation} from 'ionic/ionic';

let opacity = 0.2;
let rotateZ = '180deg';
let translateX = '100px';
let scale = 0.6;

@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html'
})
export default class IonicApp {

  constructor() {
    this.animation = new Animation();

    this.animation
      .duration(2000)
      .easing('spring', { damping: 6, elasticity: 10 });


    var ball = new Animation( document.querySelector('.ball') );
    ball
      .from('translateX', '0px')
      .to('translateX', '250px')

    this.animation.add(ball);


    var row1 = new Animation( document.querySelectorAll('.square') );
    row1
      .from('opacity', 0.8)
      .to('opacity', 0.2)

    this.animation.add(row1);

    var row2 = new Animation( document.querySelectorAll('.square2') );
    row2
      .from('rotate', '0deg')
      .from('scale', '1')
      .to('rotate', '90deg')
      .to('scale', '0.5')
      .before.addClass('added-before-play')
      .after.addClass('added-after-finish')

    this.animation.add(row1, row2);

    this.animation.onReady(animation => {
      console.log('onReady', animation);
    });

    this.animation.onPlay(animation => {
      console.log('onPlay', animation);
    });

    this.animation.onFinish(animation => {
      console.log('onFinish', animation);
    });

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

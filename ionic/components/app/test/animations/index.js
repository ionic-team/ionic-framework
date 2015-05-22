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
      .duration(1000)
      .easing('ease-in-out');


    var row1 = new Animation( document.querySelectorAll('.square') );
    row1
      .from('opacity', 1)
      .to('opacity', 0)
      .to('transform', 'scale(0)')
      .beforePlay.addClass('added-before-play')
      .afterFinish.addClass('added-after-finish')

    var row2 = new Animation( document.querySelectorAll('.square2') );
    row2
      .to('transform', 'rotate(90deg) scale(0.5)')
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

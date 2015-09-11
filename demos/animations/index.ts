import {App, Animation} from 'ionic/ionic';

@App({
  templateUrl: 'main.html'
})
class IonicApp {

  constructor() {

    this.animation = new Animation();
    this.animation
      .duration(2000)

    var ionitronSpin = new Animation(document.querySelector('#ionitron'));
    ionitronSpin
      .from('transform', 'rotate(0deg)')
      .to('transform', 'rotate(360deg)')

    this.animation.add(ionitronSpin);

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

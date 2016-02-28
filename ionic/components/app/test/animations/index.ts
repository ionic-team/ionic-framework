import {App, Page, Animation, IonicApp} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  duration;
  easing;

  constructor(app: IonicApp) {
    this.duration = '1000';
    this.easing = 'ease-in-out';

    console.log('isProd', app.isProd());
  }

  playGreen() {
    let a = new Animation('.green');
    a.fromTo('translateX', '0px', '200px');
    a.duration(parseInt(this.duration));
    a.easing(this.easing);
    a.play();
  }

  memoryCheck() {
    let self = this;
    let count = 0;

    function play() {
      count++;
      if (count >= 100) {
        console.log('Play done');
        return;
      }

      console.log('Play', count);

      let a = new Animation('.green');
      a.fromTo('translateX', '0px', '200px');
      a.duration(self.duration);
      a.easing(self.easing);
      a.onFinish((animation) => {
        setTimeout(() => {
          play();
        }, 100);
        animation.destroy();
      });
      a.play();
    }

    play();
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>',
  prodMode: true
})
class E2EApp {
  root;

  constructor() {
    this.root = E2EPage;
  }
}

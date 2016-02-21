import {App, Page, Animation, IonicApp} from '../../../../../ionic/ionic';


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

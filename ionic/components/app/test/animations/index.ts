import {App, Page, Animation} from '../../../../../ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  duration;
  easing;

  constructor() {
    this.duration = '1000';
    this.easing = 'ease-in-out';
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
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;

  constructor() {
    this.root = E2EPage;
  }
}

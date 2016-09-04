import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Config, Animation } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  duration: string;
  easing: string;

  constructor(config: Config) {
    this.duration = '1000';
    this.easing = 'ease-in-out';

    console.log('isProd', config.getBoolean('prodMode'));
  }

  playGreen() {
    let a = new Animation('.green');
    a.fromTo('translateX', '0px', '200px');
    a.duration(parseInt(this.duration, 10));
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
      a.duration(parseInt(self.duration, 10));
      a.easing(self.easing);
      a.onFinish((animation: Animation) => {
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


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}


@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EPage
  ]
})
export class AppModule {}

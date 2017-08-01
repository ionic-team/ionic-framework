import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Animation, IonicApp, IonicModule, Platform } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  duration: string;
  easing: string;

  constructor(public plt: Platform) {
    this.duration = '1000';
    this.easing = 'ease-in-out';
  }

  playGreen() {
    let a = new Animation(this.plt, '.green');
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

      let a = new Animation(self.plt, '.green');
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
export class AppComponent {
  root = E2EPage;
}


@NgModule({
  declarations: [
    AppComponent,
    E2EPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EPage
  ]
})
export class AppModule {}

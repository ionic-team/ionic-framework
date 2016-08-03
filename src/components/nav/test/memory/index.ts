import { Component } from '@angular/core';
import { ionicBootstrap, NavController } from '../../../../../src';


let delay = 100;
let animate = false;
let count = 0;

@Component({
  template: `
    <ion-content padding text-center>
      <p>Page 1</p>
      <button (click)="stop()">Stop</button>
      <button (click)="play()">Play</button>
    </ion-content>
  `
})
class Page1 {
  tmr: number;

  constructor(private nav: NavController) {}

  play() {
    this.tmr = setTimeout(() => {
      count++;
      console.log('push', count);

      this.nav.push(Page2, null, {
        animate: animate
      });
    }, delay);
  }

  ionViewDidEnter() {
    this.play();
  }

  stop() {
    clearTimeout(this.tmr);
  }
}

@Component({
  template: `
    <ion-content padding text-center>
      <p>Page 2</p>
      <button (click)="stop()">Stop</button>
      <button (click)="play()">Play</button>
    </ion-content>
  `
})
class Page2 {
  tmr: number;

  constructor(private nav: NavController) {}

  play() {
    this.tmr = setTimeout(() => {
      count++;
      console.log('pop', count);

      this.nav.pop({
        animate: animate
      });
    }, delay);
  }

  ionViewDidEnter() {
    this.play();
  }

  stop() {
    clearTimeout(this.tmr);
  }
}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root = Page1;
}

ionicBootstrap(E2EApp);

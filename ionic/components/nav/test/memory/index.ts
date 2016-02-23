import {App, Page, NavController} from 'ionic-angular';


let delay = 100;
let animate = false;
let count = 0;

@Page({
  template: `
    <ion-content padding text-center>
      <p>Page 1</p>
      <button (click)="stop()">Stop</button>
      <button (click)="play()">Play</button>
    </ion-content>
  `
})
class Page1 {
  tmr;

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

  onPageDidEnter() {
    this.play();
  }

  stop() {
    clearTimeout(this.tmr);
  }
}

@Page({
  template: `
    <ion-content padding text-center>
      <p>Page 2</p>
      <button (click)="stop()">Stop</button>
      <button (click)="play()">Play</button>
    </ion-content>
  `
})
class Page2 {
  tmr;

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

  onPageDidEnter() {
    this.play();
  }

  stop() {
    clearTimeout(this.tmr);
  }
}


@App({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root;

  constructor() {
    this.root = Page1;
  }
}

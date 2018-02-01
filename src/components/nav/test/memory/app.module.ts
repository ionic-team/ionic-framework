import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController } from '../../../..';


let delay = 100;
let animate = false;
let count = 0;

@Component({
  template: `
    <ion-content padding text-center>
      <p>Page 1</p>
      <button ion-button (click)="stop()">Stop</button>
      <button ion-button (click)="play()">Play</button>
    </ion-content>
  `
})
export class Page1 {
  tmr: number;

  constructor(private nav: NavController) {}

  play() {
    this.tmr = (<any>setTimeout(() => {
      count++;
      console.log('push', count);

      this.nav.push(Page2, null, {
        animate: animate
      });
    }, delay));
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
      <button ion-button (click)="stop()">Stop</button>
      <button ion-button (click)="play()">Play</button>
    </ion-content>
  `
})
export class Page2 {
  tmr: number;

  constructor(public navCtrl: NavController) {}

  play() {
    this.tmr = (<any>setTimeout(() => {
      count++;
      console.log('pop', count);

      this.navCtrl.pop({
        animate: animate
      });
    }, delay));
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
export class AppComponent {
  root = Page1;
}

@NgModule({
  declarations: [
    AppComponent,
    Page1,
    Page2
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Page1,
    Page2
  ]
})
export class AppModule {}

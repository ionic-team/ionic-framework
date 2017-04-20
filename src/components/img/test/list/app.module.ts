import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: {avatar: string, thumbnail: string, id: number}[] = [];

  constructor() {
    for (var i = 0; i < 100; i++) {
      this.items.push({
        id: i,
        avatar: getRandomImg(),
        thumbnail: getRandomImg()
      });
    }
  }

}

const images = [
  'bandit.jpg',
  'batmobile.jpg',
  'blues-brothers.jpg',
  'bueller.jpg',
  'delorean.jpg',
  'eleanor.jpg',
  'general-lee.jpg',
  'ghostbusters.jpg',
  'knight-rider.jpg',
  'mirth-mobile.jpg'
];

function getRandomImg(): string {
  let imgString = images[Math.floor(Math.random() * images.length)];
  let src = 'assets/img/' + imgString;
  return src;
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
    AppComponent,
    E2EPage
  ]
})
export class AppModule {}

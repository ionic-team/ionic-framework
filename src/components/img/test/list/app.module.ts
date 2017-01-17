import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../../ionic-angular';


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
  let src = '../img/' + imgString;
  return src;
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
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}

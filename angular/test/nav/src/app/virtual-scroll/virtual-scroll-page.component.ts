import { Component } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-virtual-scroll-page',
  template: `
  <ion-app>
      <ion-header>
        <ion-toolbar>
          <ion-title>Test</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content>

      <ion-virtual-scroll [items]="items" approxItemHeight="320px">

    <ion-card *virtualItem="let item; let itemBounds = bounds;">

      <div>
        <img [src]="item.imgSrc" [height]="item.imgHeight" [alt]="item.name">
      </div>

      <ion-card-header>
        <ion-card-title>{{ item.name }}</ion-card-title>
      </ion-card-header>
      <ion-card-content>{{ item.content }}</ion-card-content>

    </ion-card>

  </ion-virtual-scroll>

    </ion-content>
  </ion-app>`
})
export class VirtualScrollPageComponent {
  items: any[] = [];

  constructor() {
    for (let i = 0; i < 1000; i++) {
      this.items.push({
        name: i + ' - ' + images[rotateImg],
        imgSrc: getImgSrc(),
        avatarSrc: getImgSrc(),
        imgHeight: Math.floor((Math.random() * 50) + 150),
        content: lorem.substring(0, (Math.random() * (lorem.length - 100)) + 100)
      });

      rotateImg++;
      if (rotateImg === images.length) {
        rotateImg = 0;
      }
    }
  }

}


const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed' +
'do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim' +
' veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo ' +
'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non' +
' proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const images = [
  'bandit',
  'batmobile',
  'blues-brothers',
  'bueller',
  'delorean',
  'eleanor',
  'general-lee',
  'ghostbusters',
  'knight-rider',
  'mirth-mobile',
];

function getImgSrc() {
  const src = `https://dummyimage.com/600x400/${Math.round(Math.random() * 99999)}/fff.png`;
  rotateImg++;
  if (rotateImg === images.length) {
    rotateImg = 0;
  }
  return src;
}

let rotateImg = 0;

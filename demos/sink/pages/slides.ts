import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Slides</ion-title></ion-navbar>

  <ion-content padding>
    <h2>Slides</h2>
    <p>
      Slides have a set of pages that can be swiped between.
    </p>
    <p>
      Slides are perfect for making image slideshows,
      swipe tutorials, or document viewers.
    </p>
    <ion-slides style="height: 300px">
      <ion-slide style="background-color: #387ef5">
        <h2 style="color: #fff">Page 1</h2>
      </ion-slide>
      <ion-slide style="background-color: rgb(245, 255, 96)">
        <h2 style="color: #222;"">Page 2</h2>
      </ion-slide>
      <ion-slide style="background-color: pink">
        <h2>Page 3</h2>
      </ion-slide>
      <ion-slide style="background-color: red">
        <h2>Page 4</h2>
      </ion-slide>
      <ion-slide style="background-color: rgb(1, 157, 157)">
        <h2>Page 5</h2>
      </ion-slide>
      <ion-pager>
      </ion-pager>
    </ion-slides>
  </ion-content>
  <style>
    .slide {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
    .slide h2 {
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-size: 16px;
    }
  </style>
  `
})
export class SlidePage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);
  }
}

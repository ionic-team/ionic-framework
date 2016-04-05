import {ViewEncapsulation} from 'angular2/core';
import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None
})
class E2EPage {
  items = [];

  constructor() {
    for (var i = 0; i < 500; i++) {
      this.items.push({
        imgSrc: `../../img/img/${images[rotateImg]}.jpg?${Math.random()}`,
        imgHeight: Math.floor((Math.random() * 50) + 150),
        name: i + ' - ' + images[rotateImg],
        content: lorem.substring(0, (Math.random() * (lorem.length - 100)) + 100)
      });

      rotateImg++;
      if (rotateImg === images.length) rotateImg = 0;
    }
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>',
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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

let rotateImg = 0;

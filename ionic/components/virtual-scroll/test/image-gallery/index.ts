import {ViewEncapsulation} from 'angular2/core';
import {App, Page} from 'ionic-angular';


@Page({
  templateUrl: 'main.html',
  encapsulation: ViewEncapsulation.None
})
class E2EPage {
  lastMonth: number;
  items = [];

  constructor() {
    var utcSeconds = 787523438; // Dec 15, 1994
    var d = new Date(0);
    d.setUTCSeconds(utcSeconds);

    for (var i = 0; i < 1000; i++) {
      this.items.push({
        index: i,
        date: d,
        imgSrc: `../../img/img/${images[rotateImg]}.jpg?${Math.random()}`,
      });

      rotateImg++;
      if (rotateImg === images.length) rotateImg = 0;

      if (i < 100) {
        utcSeconds += 237600; // 2.75 days
      } else {
        utcSeconds += (Math.random() * 237600) + 86400;
      }

      d = new Date(0);
      d.setUTCSeconds(utcSeconds);
    }
  }

  headerFn(record: any, recordIndex: number, records: any[]) {
    if (this.lastMonth !== record.date.getMonth()) {
      this.lastMonth = record.date.getMonth();

      return {
        date: monthNames[this.lastMonth] + ' ' + record.date.getFullYear()
      }
    }

    return null;
  }

  footerFn(record: any, recordIndex: number, records: any[]) {

    if (recordIndex === records.length - 1) {
      return true;

    } else {
      if (records[recordIndex + 1].date.getMonth() !== this.lastMonth) {
        return true;
      }
    }

    return null;
  }

  ngDoCheck() {
    console.log('DoCheck')
  }

  reload() {
    window.location.reload(true);
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

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

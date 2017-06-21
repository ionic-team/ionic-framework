import { Component, ViewChild } from '@angular/core';
import { Content, InfiniteScroll, NavController } from '../../../../../..';

import { PageTwo } from '../page-two/page-two';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  items: number[] = [];
  enabled: boolean = true;

  constructor(public navCtrl: NavController) {
    for (var i = 0; i < 30; i++) {
      this.items.unshift( this.items.length );
    }
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('Begin async operation');

    getAsyncData().then(newData => {
      for (var i = 0; i < newData.length; i++) {
        this.items.unshift( this.items.length );
      }

      console.log('Finished receiving data, async operation complete');
      infiniteScroll.complete();

      if (this.items.length > 90) {
        this.enabled = false;
      }
    });
  }

  goToPage2() {
    this.navCtrl.push(PageTwo);
  }

  toggleInfiniteScroll() {
    this.enabled = !this.enabled;
  }
}


function getAsyncData(): Promise<any[]> {
  // async return mock data
  return new Promise(resolve => {

    setTimeout(() => {
      let data: number[] = [];
      for (var i = 0; i < 30; i++) {
        data.unshift(i);
      }

      resolve(data);
    }, 2000);

  });
}

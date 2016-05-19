import {ViewChild} from '@angular/core';
import {App, Page, InfiniteScroll, NavController} from '../../../../../ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage1 {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  items = [];
  enabled: boolean = true;

  constructor(private nav: NavController) {
    for (var i = 0; i < 30; i++) {
      this.items.push( this.items.length );
    }
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    console.log('Begin async operation');

    getAsyncData().then(newData => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push( this.items.length );
      }

      console.log('Finished receiving data, async operation complete');
      infiniteScroll.complete();

      if (this.items.length > 90) {
        this.enabled = false;
        infiniteScroll.enable(this.enabled);
      }
    });
  }

  goToPage2() {
    this.nav.push(E2EPage2);
  }

  toggleInfiniteScroll() {
    this.enabled = !this.enabled;
    this.infiniteScroll.enable(this.enabled);
  }
}


@Page({
  template: '<ion-content><button (click)="nav.pop()">Pop</button></ion-content>'
})
class E2EPage2 {

  constructor(private nav: NavController) {}

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage1;
  }
}

function getAsyncData(): Promise<any[]> {
  // async return mock data
  return new Promise(resolve => {

    setTimeout(() => {
      let data = [];
      for (var i = 0; i < 30; i++) {
        data.push(i);
      }

      resolve(data);
    }, 500);

  });
}

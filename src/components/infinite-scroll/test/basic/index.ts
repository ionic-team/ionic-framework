import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, InfiniteScroll, NavController } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage1 {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  items: number[] = [];
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


@Component({
  template: '<ion-content><button (click)="nav.pop()">Pop</button></ion-content>'
})
class E2EPage2 {
  constructor(private nav: NavController) {}
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root = E2EPage1;
}

ionicBootstrap(E2EApp);


function getAsyncData(): Promise<any[]> {
  // async return mock data
  return new Promise(resolve => {

    setTimeout(() => {
      let data: number[] = [];
      for (var i = 0; i < 30; i++) {
        data.push(i);
      }

      resolve(data);
    }, 500);

  });
}

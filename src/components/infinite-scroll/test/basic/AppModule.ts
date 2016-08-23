import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, InfiniteScroll, NavController } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage1 {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  items: number[] = [];
  enabled: boolean = true;

  constructor(public navCtrl: NavController) {
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
    this.navCtrl.push(E2EPage2);
  }

  toggleInfiniteScroll() {
    this.enabled = !this.enabled;
    this.infiniteScroll.enable(this.enabled);
  }
}


@Component({
  template: '<ion-content><button ion-button (click)="navCtrl.pop()">Pop</button></ion-content>'
})
export class E2EPage2 {
  constructor(public navCtrl: NavController) {}
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage1;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage1,
    E2EPage2
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage1,
    E2EPage2
  ]
})
export class AppModule {}


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

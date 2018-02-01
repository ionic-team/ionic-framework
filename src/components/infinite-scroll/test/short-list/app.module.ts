import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScroll, IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  items: number[] = [];

  constructor() {
    for (var i = 0; i < 5; i++) {
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
        infiniteScroll.enable(false);
      }
    });
  }

}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  rootPage = E2EPage;
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
    E2EPage
  ]
})
export class AppModule {}

function getAsyncData(): Promise<number[]> {
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

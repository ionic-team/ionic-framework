import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Refresher } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class Page1 {
  items: string[] = [];

  constructor() {
    for (var i = 0; i < 15; i++) {
      this.items.push( getRandomData() );
    }
  }

  doRefresh(refresher: Refresher) {
    console.info('Begin async operation');

    getAsyncData().then((newData: string[]) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.unshift( newData[i] );
      }

      console.info('Finished receiving data, async operation complete');
      refresher.complete();
    });
  }

  doStart(refresher: Refresher) {
    console.info('Refresher, start');
  }

  doPulling(refresher: Refresher) {
    console.info('Pulling', refresher.progress);
  }

}

function getAsyncData() {
  // async return mock data
  return new Promise(resolve => {

    setTimeout(() => {
      let data: string[] = [];
      for (var i = 0; i < 3; i++) {
        data.push( getRandomData() );
      }

      resolve(data);
    }, 1000);

  });
}

function getRandomData() {
  let i = Math.floor( Math.random() * data.length );
  return data[i];
}

const data = [
  'Fast Times at Ridgemont High',
  'Peggy Sue Got Married',
  'Raising Arizona',
  'Moonstruck',
  'Fire Birds',
  'Honeymoon in Vegas',
  'Amos & Andrew',
  'It Could Happen to You',
  'Trapped in Paradise',
  'Leaving Las Vegas',
  'The Rock',
  'Con Air',
  'Face/Off',
  'City of Angels',
  'Gone in Sixty Seconds',
  'The Family Man',
  'Windtalkers',
  'Matchstick Men',
  'National Treasure',
  'Ghost Rider',
  'Grindhouse',
  'Next',
  'Kick-Ass',
  'Drive Angry'
];


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class E2EApp {
  rootPage = Page1;
}

@NgModule({
  declarations: [
    E2EApp,
    Page1
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    Page1
  ]
})
export class AppModule {}

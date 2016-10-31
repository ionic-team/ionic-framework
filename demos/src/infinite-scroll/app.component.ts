import { Component, Injectable } from '@angular/core';
import { InfiniteScroll } from 'ionic-angular';

/**
 * Mock Data Access Object
 **/
@Injectable()
export class MockProvider {

  getData(): any[] {
    // return mock data synchronously
    let data = [];
    for (var i = 0; i < 20; i++) {
      data.push( this._getRandomData() );
    }
    return data;
  }

  getAsyncData(): Promise<any[]> {
    // async receive mock data
    return new Promise(resolve => {

      setTimeout(() => {
        resolve(this.getData());
      }, 1000);

    });
  }

  private _getRandomData() {
    let i = Math.floor( Math.random() * this._data.length );
    return this._data[i];
  }

  private _data = [
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
    'Drive Angry',
  ];

}


@Component({
  templateUrl: 'page.html',
  providers: [MockProvider]
})
export class ApiDemoApp {
  items: string[];

  constructor(private mockProvider: MockProvider) {
    this.items = mockProvider.getData();
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.mockProvider.getAsyncData().then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push( newData[i] );
      }

      infiniteScroll.complete();

      if (this.items.length > 90) {
        infiniteScroll.enable(false);
      }
    });
  }

}

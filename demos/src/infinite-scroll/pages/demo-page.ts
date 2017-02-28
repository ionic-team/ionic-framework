import { Component } from '@angular/core';
import { MockProvider} from '../app/provider';
import { InfiniteScroll } from '../../../../src';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
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

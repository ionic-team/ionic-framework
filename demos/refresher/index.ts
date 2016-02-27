import {App, Page, Refresher} from 'ionic-angular';
import {MockProvider} from './mock-provider';


@App({
  templateUrl: 'main.html',
  providers: [MockProvider]
})
class ApiDemoApp {
  items: string[];

  constructor(private mockProvider: MockProvider) {
    this.items = mockProvider.getData();
  }

  doRefresh(refresher: Refresher) {
    console.log('DOREFRESH', refresher);

    this.mockProvider.getAsyncData().then((newData) => {
      for (var i = 0; i < newData.length; i++) {
        this.items.unshift( newData[i] );
      }

      refresher.endRefreshing();
    });
  }

  doPulling(refresher: Refresher) {
    console.log('DOPULLING', refresher.progress);
  }
}

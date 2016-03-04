import {App, InfiniteScroll} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  items = [];

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

function getAsyncData(): Promise<number[]> {
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

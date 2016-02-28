import {App} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  items = [];

  constructor() {
    for (var i = 0; i < 3; i++) {
      this.items.push( getRandomData() );
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation');

    getAsyncData().then(newData => {
      for (var i = 0; i < newData.length; i++) {
        this.items.unshift( newData[i] );
      }

      console.log('Finished receiving data, async operation complete');
      refresher.endRefreshing();
    });
  }

  doStart(refresher) {
    console.log('Refresher, start');
  }

  doPulling(refresher) {
    console.log('Pulling', refresher.progress);
  }

}

function getAsyncData() {
  // async return mock data
  return new Promise(resolve => {

    setTimeout(() => {
      let data = [];
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
import {App} from '../../../../../ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  items = [];

  constructor() {
    for(let i = 0; i < 20; i++) {
      this.items.push({ "index": i });
    }
  }

  doRefresh(refresher) {
    console.log('Doing Refresh', refresher)

    // Add to the top of the list on refresh
    let firstIndex = this.items[0].index - 1;

    for(let i = firstIndex; i > firstIndex - 5; i--) {
      this.items.unshift({ "index": i });
    }

    setTimeout(() => {
      refresher.complete();
      console.log("Complete");
    }, 5000);
  }

  doStart(refresher) {
    console.log('Doing Start', refresher);
  }

  doPulling(refresher) {
    console.log('Pulling', refresher);
  }
}

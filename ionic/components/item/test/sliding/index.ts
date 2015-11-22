import {App, IonicApp} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(private app: IonicApp) {
    setTimeout(() => {
      this.shouldShow = true;
    }, 10);
  }

  closeOpened() {
    this.app.getComponent('myList').closeSlidingItems();
  }

  getItems() {
    let items = [];
    for (let x = 0; x < 20; x++) {
      items.push(x);
    }
    return items;
  }

  didClick(item) {
    console.log('CLICK')
  }

  archive(item) {
    console.log('Archive', item);
    item.close();
  }

  del(item) {
    console.log('Delete', item);
    item.close();
  }

  reload() {
    window.location.reload();
  }
}

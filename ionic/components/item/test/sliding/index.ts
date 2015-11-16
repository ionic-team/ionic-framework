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

  didClick(ev, item) {
    console.log('CLICK', ev.defaultPrevented, ev)
  }

  archive(ev, item) {
    console.log('Archive', ev, item);
    item.close();
  }

  del(ev, item) {
    console.log('Delete', ev, item);
    item.close();
  }

  reload() {
    window.location.reload();
  }
}

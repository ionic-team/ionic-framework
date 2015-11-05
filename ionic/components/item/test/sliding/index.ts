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
    return [0,1];
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
}

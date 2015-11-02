import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor() {
    setTimeout(() => {
      this.shouldShow = true;
    }, 10);
  }

  getItems() {
    console.log('getItems');
    return [0,1];
  }

  didClick(e) {
    console.log('CLICK', e.defaultPrevented, e)
  }

  archive(e) {
    console.log('Accept', e);
  }
  del(e) {
    console.log('Delete', e);
  }
}

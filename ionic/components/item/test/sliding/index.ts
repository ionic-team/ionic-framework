import {App, IonicApp, Popup} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  constructor(private app: IonicApp, private popup: Popup) {
    this.items = [];
    for (let x = 0; x < 20; x++) {
      this.items.push(x);
    }

    this.shouldShow = true;
  }

  closeOpened() {
    this.app.getComponent('myList').closeSlidingItems();
  }

  didClick(item) {
    console.log('Clicked, ion-item');

    this.popup.alert({
      title: 'Clicked ion-item!'
    });
  }

  archive(item) {
    console.log('Archive, ion-item-options button', item);

    this.popup.alert({
      title: 'Archived!'
    }).then(() => {
      item.close();
    });
  }

  del(item) {
    console.log('Delete ion-item-options button', item);

    this.popup.alert({
      title: 'Deleted!'
    }).then(() => {
      item.close();
    });
  }

  reload() {
    window.location.reload();
  }
}

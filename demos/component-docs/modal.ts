import {App, IonicApp, Modal, NavController, IonicView, Events} from 'ionic/ionic';
import * as helpers from 'helpers';

@IonicView({
  templateUrl: 'modal.html'
})
class ModalFirstPage {

  constructor(
    nav: NavController,
    modal: Modal,
    events: Events
  ) {
    this.nav = nav;
    this.modal = modal;
    window.onmessage = (e) => {
      zone.run(() => {
        if (e.data) {
          var data = JSON.parse(e.data);
          var componentTitle = helpers.toTitleCase(data.hash.replace('-', ' '));
          events.publish('page:locationChange', { componentName: componentTitle });
          this.closeModal();
        }
      });
    };
  }

  closeModal() {
    let modal = this.modal.get();
    if (modal) {
      modal.close();
    }
  }

}

@IonicView({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
export class DemoModal {
  constructor() {
    this.rootView = ModalFirstPage;
  }
}



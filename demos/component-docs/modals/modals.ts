import {App, IonicApp, Animation, Modal, NavController, Page, Events} from 'ionic/ionic';
import * as helpers from './helpers';


@Page({
  templateUrl: 'modals/modals.html'
})
class ModalsFirstPage {

  constructor(
    nav: NavController,
    modal: Modal,
    events: Events
  ) {
    this.nav = nav;
    this.modal = modal;
  }

  openModal() {
    this.modal.open(ModalsContentPage);
  }

}

@Page({
  templateUrl: 'modals/modals-content.html'
})
class ModalsContentPage {

  constructor(
    modal: Modal,
    events: Events
  ) {
    this.modal = modal;
  }

  closeModal() {
    let modal = this.modal.get();
    if (modal) {
      modal.close();
    }
  }
}

@Page({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
export class ModalsPage {
  constructor() {
    this.rootView = ModalsFirstPage;
  }
}

import {App, IonicApp, Animation, Modal, NavController, Page, Events} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';


@Page({
  templateUrl: 'modals/modals.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
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
  templateUrl: 'modals/modals-content.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]

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
  constructor(modal: Modal) {
    this.rootView = ModalsFirstPage;
    this.modal = modal;
  }
  onPageWillLeave() {
    let modal = this.modal.get();
    if (modal) {
      modal.close();
    }
  }
}

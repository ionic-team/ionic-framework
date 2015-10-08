import {App, IonicApp, Animation, Modal, NavController, IonicView, Events} from 'ionic/ionic';
import * as helpers from 'helpers';


@IonicView({
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
    this.modal.open(ModalsContentPage, {
      handle: 'my-awesome-modal',
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out'
    });
  }

}

@IonicView({
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

@IonicView({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
export class ModalsPage {
  constructor() {
    this.rootView = ModalsFirstPage;
  }
}

class FadeIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease')
      .duration(450)
      .fadeIn();
  }
}

Animation.register('my-fade-in', FadeIn);

class FadeOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease')
      .duration(250)
      .fadeOut();
  }
}

Animation.register('my-fade-out', FadeOut);

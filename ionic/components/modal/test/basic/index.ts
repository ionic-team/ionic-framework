import {App, IonicView, IonicApp, IonicConfig, Platform} from 'ionic/ionic';
import {Modal, ActionMenu, NavController, NavParams, Animation} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class MyAppCmp {

  constructor(modal: Modal, app: IonicApp, ionicConfig: IonicConfig) {
    this.modal = modal;

    console.log('platforms', Platform.platforms());
    console.log('mode', ionicConfig.setting('mode'));

    console.log('core', Platform.is('core'))
    console.log('cordova', Platform.is('cordova'))
    console.log('mobile', Platform.is('mobile'))
    console.log('ipad', Platform.is('ipad'))
    console.log('iphone', Platform.is('iphone'))
    console.log('phablet', Platform.is('phablet'))
    console.log('tablet', Platform.is('tablet'))
    console.log('ios', Platform.is('ios'))
    console.log('android', Platform.is('android'))
    console.log('windows phone', Platform.is('windowsphone'))

    console.log('isRTL', app.isRTL())

    Platform.ready().then(() => {
      console.log('Platform.ready')
    });

  }

  openModal() {
    this.modal.open(ContactModal, {
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out',
      handle: 'my-awesome-modal'
    });
  }
}

@IonicView({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
export class ContactModal {
  constructor() {
    console.log('ContactModal constructor')
    this.rootView = ModalFirstPage;
  }
  viewLoaded() {
    console.log('ContactModal viewLoaded');
  }
  viewWillEnter() {
    console.log('ContactModal viewWillEnter');
  }
  viewDidEnter() {
    console.log('ContactModal viewDidEnter');
  }
  viewWillLeave() {
    console.log('ContactModal viewWillLeave');
  }
  viewDidLeave() {
    console.log('ContactModal viewDidLeave');
  }
  viewWillUnload() {
    console.log('ContactModal viewWillUnload');
  }
  viewDidUnload() {
    console.log('ContactModal viewDidUnload');
  }
}


@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>First Page Header</ion-title><ion-nav-items primary><button id="e2eCloseMenu" (click)="closeModal()">Close</button></ion-nav-items></ion-navbar>
    <ion-content class="padding">
      <p>
        <button primary (click)="push()">Push (Go to 2nd)</button>
      </p>
      <p>
        <button primary (click)="openActionMenu()">Open Action Menu</button>
      </p>
      <p>
        <button primary (click)="closeByHandeModal()">Close By Handle</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `
})
export class ModalFirstPage {
  constructor(
    nav: NavController,
    modal: Modal,
    actionMenu: ActionMenu
  ) {
    this.nav = nav;
    this.modal = modal;
    this.actionMenu = actionMenu;
  }

  push() {
    this.nav.push(ModalSecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }

  closeModal() {
    let modal = this.modal.get();
    modal.close();
  }

  closeByHandeModal() {
    let modal = this.modal.get('my-awesome-modal');
    modal.close();
  }

  openActionMenu() {
    this.actionMenu.open({
      buttons: [
        { text: 'Share This' },
        { text: 'Move' }
      ],
      destructiveText: 'Delete',
      titleText: 'Modify your album',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('Canceled');
      },
      destructiveButtonClicked: () => {
        console.log('Destructive clicked');
      },
      buttonClicked: function(index) {
        console.log('Button clicked', index);
        if(index == 1) { return false; }
        return true;
      }
    }).then(actionMenuRef => {
      this.actionMenuRef = actionMenuRef;
    });
  }
}


@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>Second Page Header</ion-title></ion-navbar>
    <ion-content class="padding">
      <p>
        <button primary (click)="nav.pop()">Pop (Go back to 1st)</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `
})
export class ModalSecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.params = params;

    console.log('Second page params:', params);
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

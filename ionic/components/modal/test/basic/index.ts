import {App, Page, Config, Platform} from 'ionic/ionic';
import {Modal, ActionSheet, NavController, NavParams, Animation} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  constructor(modal: Modal, config: Config, platform: Platform) {
    this.modal = modal;

    console.log('platforms', platform.platforms());
    console.log('mode', config.get('mode'));

    console.log('core', platform.is('core'))
    console.log('cordova', platform.is('cordova'))
    console.log('mobile', platform.is('mobile'))
    console.log('ipad', platform.is('ipad'))
    console.log('iphone', platform.is('iphone'))
    console.log('phablet', platform.is('phablet'))
    console.log('tablet', platform.is('tablet'))
    console.log('ios', platform.is('ios'))
    console.log('android', platform.is('android'))
    console.log('windows phone', platform.is('windowsphone'))

    platform.ready().then(() => {
      console.log('platform.ready');
    });
  }

  openModal() {
    this.modal.open(ModalPassParams, { userId: 3141209 });
  }

  openToolbarModal() {
    this.modal.open(ToolbarModal).then(modalRef => {
      // modal has finished opening
      // modalRef is a reference to the modal instance
      modalRef.onClose = (modalData) => {
        // somehow modalRef.close(modalData) was called w/ modalData
        console.log('modalRef.onClose', modalData)
      }
    });
  }

  openModalChildNav() {
    this.modal.open(ContactUs, null, {
      handle: 'my-awesome-modal'
    });
  }

  openModalCustomAnimation() {
    this.modal.open(ContactUs, null, {
      handle: 'my-awesome-modal',
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out'
    });
  }
}


@Page({
  template: `
    <h3>Pass Params</h3>
    <p>User Id: {{userId}}</p>
    <p><button (click)="close()">Close Modal</button></p>
  `
})
class ModalPassParams {
  constructor(private modal: Modal, params: NavParams) {
    this.userId = params.get('userId');
  }
}


@Page({
  template: `
    <ion-toolbar>
      <ion-title>Modals</ion-title>
    </ion-toolbar>

    <ion-toolbar primary>
      <ion-title>Another toolbar</ion-title>
    </ion-toolbar>

    <ion-content padding>
      <button block danger (click)="closeModal()" class="e2eCloseToolbarModal">
        <icon close></icon>
        Close Modal
      </button>
    </ion-content>
  `
})
class ToolbarModal {
  constructor(private modal: Modal) {}

  closeModal() {
    this.close({
      adel: 'hello',
      lionel: 'hello'
    });
  }

}


@Page({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
class ContactUs {
  constructor() {
    console.log('ContactUs constructor');
    this.rootView = ModalFirstPage;
  }
  onPageLoaded() {
    console.log('ContactUs onPageLoaded');
  }
  onPageWillEnter() {
    console.log('ContactUs onPageWillEnter');
  }
  onPageDidEnter() {
    console.log('ContactUs onPageDidEnter');
  }
  onPageWillLeave() {
    console.log('ContactUs onPageWillLeave');
  }
  onPageDidLeave() {
    console.log('ContactUs onPageDidLeave');
  }
  onPageWillUnload() {
    console.log('ContactUs onPageWillUnload');
  }
  onPageDidUnload() {
    console.log('ContactUs onPageDidUnload');
  }
}


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>First Page Header</ion-title>
      <ion-nav-items primary>
        <button class="e2eCloseMenu" (click)="closeModal()">Close</button>
      </ion-nav-items>
    </ion-navbar>
    <ion-content padding>
      <p>
        <button (click)="push()">Push (Go to 2nd)</button>
      </p>
      <p>
        <button (click)="openActionSheet()">Open Action Sheet</button>
      </p>
      <p>
        <button (click)="closeByHandeModal()">Close By Handle</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `
})
class ModalFirstPage {
  constructor(
    nav: NavController,
    modal: Modal,
    actionSheet: ActionSheet
  ) {
    this.nav = nav;
    this.modal = modal;
    this.actionSheet = actionSheet;
  }

  push() {
    let page = ModalSecondPage;
    let params = { id: 8675309, myData: [1,2,3,4] };
    let opts = { animation: 'ios' };

    this.nav.push(page, params, opts);
  }

  closeModal() {
    this.modal.get().close();
  }

  closeByHandeModal() {
    this.modal.get('my-awesome-modal').close();
  }

  openActionSheet() {
    this.actionSheet.open({
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
    }).then(actionSheetRef => {
      this.actionSheetRef = actionSheetRef;
    });
  }
}


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Second Page Header</ion-title>
    </ion-navbar>
    <ion-content padding>
      <p>
        <button (click)="nav.pop()">Pop (Go back to 1st)</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `
})
class ModalSecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    console.log('Second page params:', params);
  }
}


class FadeIn extends Animation {
  constructor(enteringView, leavingView) {
    super(enteringView.pageRef());
    this
      .easing('ease')
      .duration(1000)
      .fromTo('translateY', '0%', '0%')
      .fadeIn()
      .before.addClass('show-page');
  }
}
Animation.register('my-fade-in', FadeIn);

class FadeOut extends Animation {
  constructor(enteringView, leavingView) {
    super(leavingView.pageRef());
    this
      .easing('ease')
      .duration(500)
      .fadeOut()
      .before.addClass('show-page');
  }
}
Animation.register('my-fade-out', FadeOut);

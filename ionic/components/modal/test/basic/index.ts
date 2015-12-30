import {App, Page, Config, Platform} from 'ionic/ionic';
import {Modal, ActionSheet, NavController, NavParams, Animation, ViewController} from 'ionic/ionic';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor(nav: NavController, config: Config, platform: Platform) {
    this.nav = nav;
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

  presentModal() {
    let modal = Modal.create(ModalPassData, { userId: 8675309 });
    this.nav.present(modal);

    modal.onDismiss(data => {
      console.log('modal data', data);
    });
  }

  presentModalChildNav() {
    let modal = Modal.create(ContactUs);
    this.nav.present(modal);
  }

  presentToolbarModal() {
    let modal = Modal.create(ToolbarModal);
    this.nav.present(modal);

    modal.subscribe(data => {
      console.log('modal data', data);
    });
  }

  presentModalCustomAnimation() {
    let modal = Modal.create(ContactUs);
    this.nav.present(modal, {
      animation: 'my-fade-in'
    });
  }
}


@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Data in/out</ion-title>
    </ion-navbar>
    <ion-content>
      <ion-list>
        <ion-input>
          <ion-label>UserId</ion-label>
          <input type="number" [(ngModel)]="data.userId">
        </ion-input>
        <ion-input>
          <ion-label>Name</ion-label>
          <input type="text" [(ngModel)]="data.name">
        </ion-input>
      </ion-list>
      <button full (click)="submit()">Submit</button>
    </ion-content>
  `
})
class ModalPassData {
  constructor(params: NavParams, viewCtrl: ViewController) {
    this.data = {
      userId: params.get('userId'),
      name: 'Jenny'
    };
    this.viewCtrl = viewCtrl;
  }

  submit() {
    this.viewCtrl.dismiss(this.data);
  }
}


@Page({
  template: `
    <ion-toolbar primary>
      <ion-title>Toolbar 1</ion-title>
    </ion-toolbar>

    <ion-toolbar>
      <ion-title>Toolbar 2</ion-title>
    </ion-toolbar>

    <ion-content padding>
      <button block danger (click)="dismiss()" class="e2eCloseToolbarModal">
        Dismission Modal
      </button>
    </ion-content>
  `
})
class ToolbarModal {

  constructor(viewCtrl: ViewController) {
    this.viewCtrl = viewCtrl;
  }

  dismiss() {
    this.viewCtrl.emit({
      toolbar: 'data'
    });
    this.viewCtrl.dismiss();
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
      <ion-buttons start>
        <button class="e2eCloseMenu" (click)="dismiss()">Close</button>
      </ion-buttons>
    </ion-navbar>
    <ion-content padding>
      <p>
        <button (click)="push()">Push (Go to 2nd)</button>
      </p>
      <p>
        <button (click)="openActionSheet()">Open Action Sheet</button>
      </p>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
    </ion-content>
  `
})
class ModalFirstPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  push() {
    let page = ModalSecondPage;
    let params = { id: 8675309, myData: [1,2,3,4] };
    let opts = { animation: 'ios-transition' };

    this.nav.push(page, params, opts);
  }

  dismiss() {
    this.nav.rootNav.pop();
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


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  constructor() {
    this.root = E2EPage;
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

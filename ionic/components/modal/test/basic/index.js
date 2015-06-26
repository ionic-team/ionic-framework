import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent, Ancestor} from 'angular2/src/core/annotations_impl/visibility';

import {IonicView, IonicConfig} from 'ionic/ionic';

import {IonicComponent} from 'ionic/ionic';
import {Modal, NavController, NavParams, Animation, ActionMenu} from 'ionic/ionic';


@Component({
  selector: 'ion-app',
  appInjector: [Modal]
})
@IonicView({
  templateUrl: 'main.html'
})
class MyApp {

  constructor(Modal: Modal) {
    this.Modal = Modal;
  }

  openModal() {
    this.Modal.open(ContactModal, {
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out',
      handle: 'my-awesome-modal'
    });
  }
}

@IonicComponent(Modal)
@IonicView({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
export class ContactModal extends Modal {
  constructor() {
    super();
    this.rootView = ModalFirstPage;
  }
}


@Component({
  selector: 'ion-view',
  appInjector: [
    Modal,
    ActionMenu
  ]
})
@IonicView({
  template: `
    <ion-navbar *navbar><ion-title>First Page Header: {{ val }}</ion-title><ion-nav-items primary><button primary (click)="closeModal()">Close</button></ion-nav-items></ion-navbar>
    <ion-content class="padding">
      <p>First Page: {{ val }}</p>
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
    Modal: Modal,
    ActionMenu: ActionMenu
  ) {
    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;
    this.Modal = Modal;
    this.ActionMenu = ActionMenu;
  }

  push() {
    this.nav.push(ModalSecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }

  closeModal() {
    let modal = this.Modal.get();
    modal.close();
  }

  closeByHandeModal() {
    let modal = this.Modal.getByHandle('my-awesome-modal');
    modal.close();
  }

  openActionMenu() {
    this.ActionMenu.open({
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
    }).then(actionMenu => {
      this.actionMenu = actionMenu;
    });
  }
}

@Component({selector: 'ion-view'})
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

export function main(ionicBootstrap) {

  let myConfig = new IonicConfig();

  //myConfig.setting('someKey', 'userConfig');
  // myConfig.setting('ios', 'someKey', 'iosConfig');
  // myConfig.setting('ipad', 'someKey', 'ipadConfig');

  ionicBootstrap(MyApp, myConfig).then(root => {

    console.log('platforms', root.platform.platforms());
    console.log('mode', myConfig.setting('mode'));

    console.log('core', root.platform.is('core'))
    console.log('cordova', root.platform.is('cordova'))
    console.log('mobile', root.platform.is('mobile'))
    console.log('ipad', root.platform.is('ipad'))
    console.log('iphone', root.platform.is('iphone'))
    console.log('phablet', root.platform.is('phablet'))
    console.log('tablet', root.platform.is('tablet'))
    console.log('ios', root.platform.is('ios'))
    console.log('android', root.platform.is('android'))
    console.log('windows phone', root.platform.is('windowsphone'))

  });
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

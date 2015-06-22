import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent, Ancestor} from 'angular2/src/core/annotations_impl/visibility';

import {IonicView} from 'ionic/ionic';

import {IonicComponent} from 'ionic/ionic';
import {Modal, NavController, NavParams, Animation, ActionMenu} from 'ionic/ionic';


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


@Component({ selector: 'ion-view' })
@IonicView({
  templateUrl: 'main.html'
})
class IonicApp {
  openModal() {
    Modal.open(ContactModal, {
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out',
      handle: 'my-awesome-modal'
    });
  }
}

@IonicComponent(Modal)
@IonicView({
  template: '<ion-nav [initial]="initial"></ion-nav>'
})
export class ContactModal extends Modal {
  constructor() {
    super();
    this.initial = ModalFirstPage;
  }
}


@Component({selector: 'ion-view'})
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
    nav: NavController
  ) {
    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;
  }

  push() {
    this.nav.push(ModalSecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }

  closeModal() {
    let modal = Modal.get();
    modal.close();
  }

  closeByHandeModal() {
    let modal = Modal.getByHandle('my-awesome-modal');
    modal.close();
  }

  openActionMenu() {
    ActionMenu.open({
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

      <p>
        <button primary (click)="push()">Push (Go to 3rd)</button>
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

  push() {
  }

}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}

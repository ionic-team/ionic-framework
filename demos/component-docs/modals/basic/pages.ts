import {App, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events} from 'ionic/ionic';
import {forwardRef} from 'angular2/core';
import {NgFor} from 'angular2/common';
import * as helpers from '../../helpers';


@Page({
  templateUrl: 'modals/basic/template.html',
  directives: [forwardRef(() => helpers.AndroidAttribute)]
})
class ModalsInitialPage {

  constructor(
    nav: NavController,
    modal: Modal,
  ) {
    this.nav = nav;
    this.modal = modal;
  }

  openModal(characterNum) {
    this.modal.open(ModalsContentPage, characterNum);
  }


}

@Page({
  templateUrl: 'modals/basic/modal-content.html',
  directives: [NgFor, forwardRef(() => helpers.AndroidAttribute)]

})
class ModalsContentPage {

    constructor(
        modal: Modal,
        platform: Platform,
        params: NavParams
    ) {
        this.modal = modal;
        this.params = params;
        if (platform.is('android')) {
            this.currentPlatform = 'android';
        } else {
            this.currentPlatform = 'ios';
        }

        var characters = [
            {
                name: 'Gollum',
                quote: 'Sneaky little hobbitses!',
                image: 'img/avatar-gollum.jpg',
                items: [
                    { title: 'Race', note: 'Hobbit' },
                    { title: 'Culture', note: 'River Folk' },
                    { title: 'Alter Ego', note: 'Smeagol' }
                ]
            },
            {
                name: 'Frodo',
                quote: 'Go back, Sam! I\'m going to Mordor alone!',
                image: 'img/avatar-frodo.jpg',
                items: [
                    { title: 'Race', note: 'Hobbit' },
                    { title: 'Culture', note: 'Shire Folk' },
                    { title: 'Weapon', note: 'Sting' }
                ]
            },
            {
                name: 'Samwise Gamgee',
                quote: 'What we need is a few good taters.',
                image: 'img/avatar-samwise.jpg',
                items: [
                    { title: 'Race', note: 'Hobbit' },
                    { title: 'Culture', note: 'Shire Folk' },
                    { title: 'Nickname', note: 'Sam' }
                ]
            }
        ];
        this.character = characters[this.params.get('charNum')];

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
export class BasicPage {
  constructor(modal: Modal) {
    this.rootView = ModalsInitialPage;
    this.modal = modal;
  }
  onPageWillLeave() {
    let modal = this.modal.get();
    if (modal) {
      modal.close();
    }
  }
}



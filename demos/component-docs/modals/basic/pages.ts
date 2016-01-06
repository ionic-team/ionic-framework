import {App, IonicApp, Animation, Modal, Platform, NavController, NavParams, Page, Events, ViewController} from 'ionic/ionic';
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
  ) {
    this.nav = nav;
  }

  openModal(characterNum) {
    let myModal = Modal.create(ModalsContentPage, characterNum);
    this.nav.present(myModal);
  }
}

@Page({
  templateUrl: 'modals/basic/modal-content.html',
  directives: [NgFor, forwardRef(() => helpers.AndroidAttribute)]

})
class ModalsContentPage {

    constructor(
        platform: Platform,
        params: NavParams,
        viewCtrl: ViewController
    ) {
        this.viewCtrl = viewCtrl;
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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Page({
  template: '<ion-nav [root]="rootView"></ion-nav>'
})
export class BasicPage {
  constructor(viewCtrl: ViewController) {
    this.viewCtrl = viewCtrl;
    this.rootView = ModalsInitialPage;
  }
  onPageWillLeave() {
    this.viewCtrl.dismiss();

  }
}



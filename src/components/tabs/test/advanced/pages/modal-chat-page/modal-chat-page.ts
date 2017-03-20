import { Component } from '@angular/core';
import { IonicPage, ViewController } from '../../../../../..';

@IonicPage({
  name: 'modal-chat-page'
})
@Component({
  templateUrl: './modal-chat-page.html'
})
export class ModalChatPage {

  constructor(
    public viewCtrl: ViewController
  ) { }

  ionViewDidLoad() {
    console.log('ModalChat, ionViewDidLoad');
  }

  ionViewWillUnload() {
    console.log('ModalChat, ionViewWillUnload');
  }
}

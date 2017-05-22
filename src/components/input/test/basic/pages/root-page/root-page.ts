import { Component } from '@angular/core';
import { NavController } from '../../../../../..';
import { ChatPage } from '../chat-page/chat-page';


@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {

  user: string = '';
  password: string = '';

  constructor(public nav: NavController) { }

  push() {
    this.nav.push(ChatPage);
  }

}

import { Component } from '@angular/core';

@Component({
  templateUrl: 'chat-page.html'
})
export class ChatPage {
  messages: string[] = ['hola', 'que tal?', 'el keyboard ya funcionaaa!!'];
  draft: string = '';

  addMessage() {
    this.messages.push(this.draft);
    this.draft = '';
  }

}

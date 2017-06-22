import { Component, h, Prop, Ionic } from '@stencil/core';

@Component({
  tag: 'comments-page'
})
export class CommentsPage {

  @Prop() comments: string;

  close() {
    Ionic.emit(this, 'ionDismiss');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-button class='close-button' clear slot='start' on-click={this.close.bind(this)}>
            <ion-icon slot='icon-only' name='close' style={{ color: 'white'}} />
          </ion-button>
          <ion-title class='comments-title' slot='end'>
            Comments
          </ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <comments-list type={this.comments}></comments-list>
      </ion-content>
    ];
  }
}

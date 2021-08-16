import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'med-message-list',
  styleUrl: 'med-message-list.scss',
  shadow: true,
})
export class MedMessageList {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}

import { Component, ComponentInterface, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'ion-page',
  styleUrl: 'page.scss'
})
export class Page implements ComponentInterface {

  @Element() el!: HTMLElement;

  render() {
    return (
      <Host
        class={{
          'ion-page': true
        }}
      >
      </Host>
    );
  }
}

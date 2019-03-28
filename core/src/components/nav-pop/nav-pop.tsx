import { Component, ComponentInterface, Element, Listen, Host, h } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
})
export class NavPop implements ComponentInterface {

  @Element() el!: HTMLElement;

  private onClick = () => {
    const nav = this.el.closest('ion-nav');
    if (nav) {
      nav.pop({ skipIfBusy: true });
    }
  }

  render() {
    return <Host onClick={this.onClick}></Host>;
  }
}

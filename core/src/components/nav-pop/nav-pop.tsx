import { Component, ComponentInterface, Element, Host, h } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
})
export class NavPop implements ComponentInterface {

  @Element() el!: HTMLElement;

  componentDidLoad() {
    console.warn('`<ion-nav-pop>` is deprecated. Use `<ion-nav-link routerDirection="back">` instead.');
  }

  private pop = () => {
    const nav = this.el.closest('ion-nav');
    if (nav) {
      nav.pop({ skipIfBusy: true });
    }
  }

  render() {
    return (
      <Host onClick={this.pop}></Host>
    );
  }
}

import { Component, ComponentInterface, Element, Listen } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
})
export class NavPop implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Listen('click')
  pop() {
    const nav = this.el.closest('ion-nav');
    if (nav) {
      nav.pop({ skipIfBusy: true });
    }
  }

}

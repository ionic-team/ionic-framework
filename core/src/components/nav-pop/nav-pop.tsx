import { Component, Element, Listen } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
})
export class NavPop {

  @Element() el!: HTMLElement;

  @Listen('child:click')
  pop() {
    const nav = this.el.closest('ion-nav');
    if (nav) {
      nav.pop({ skipIfBusy: true });
    }
  }

}

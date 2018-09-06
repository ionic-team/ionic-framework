import { Component, Element, Listen, Prop } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';

@Component({
  tag: 'ion-nav-push'
})
export class NavPush {
  @Element() el!: HTMLElement;

  /**
   * Component to navigate to
   */
  @Prop() component?: NavComponent;

  /**
   * Data you want to pass to the component as props
   */
  @Prop() componentProps?: ComponentProps;

  @Listen('child:click')
  push() {
    const nav = this.el.closest('ion-nav');
    const toPush = this.component;
    if (nav && toPush !== undefined) {
      return nav.push(toPush, this.componentProps, { skipIfBusy: true });
    }
    return Promise.resolve(false);
  }
}

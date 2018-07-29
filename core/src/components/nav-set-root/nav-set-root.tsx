import { Component, Element, Listen, Prop } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';

@Component({
  tag: 'ion-nav-set-root'
})
export class NavSetRoot {
  @Element() el!: HTMLElement;

  /**
   * Component you want to make root for the navigation stack
   *
   */
  @Prop() component?: NavComponent;

  /**
   * Data you want to pass to the component as props
   */
  @Prop() componentProps?: ComponentProps;

  @Listen('child:click')
  push(): Promise<any> {
    const nav = this.el.closest('ion-nav');
    const toPush = this.component;
    if (nav && toPush) {
      return nav.setRoot(toPush, this.componentProps);
    }
    return Promise.resolve(null);
  }
}

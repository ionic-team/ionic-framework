import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';

@Component({
  tag: 'ion-nav-set-root'
})
export class NavSetRoot implements ComponentInterface {
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

  private setRoot = () => {
    const nav = this.el.closest('ion-nav');
    const toPush = this.component;
    if (nav && toPush !== undefined) {
      nav.setRoot(toPush, this.componentProps, { skipIfBusy: true });
    }
  }

  render() {
    return (
      <Host onClick={this.setRoot}></Host>
    );
  }
}

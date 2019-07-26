import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';

@Component({
  tag: 'ion-nav-push'
})
export class NavPush implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * Component to navigate to
   */
  @Prop() component?: NavComponent;

  /**
   * Data you want to pass to the component as props
   */
  @Prop() componentProps?: ComponentProps;

  private push = () => {
    const nav = this.el.closest('ion-nav');
    const toPush = this.component;
    if (nav && toPush !== undefined) {
      nav.push(toPush, this.componentProps, { skipIfBusy: true });
    }
  }

  render() {
    return (
      <Host onClick={this.push}></Host>
    );
  }
}

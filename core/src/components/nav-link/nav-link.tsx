import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { ComponentProps, NavComponent, RouterDirection } from '../../interface';

import { navLink } from './nav-link-utils';

@Component({
  tag: 'ion-nav-link'
})
export class NavLink implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * Component to navigate to. Only used if the `routerDirection` is `"forward"` or `"root"`.
   */
  @Prop() component?: NavComponent;

  /**
   * Data you want to pass to the component as props. Only used if the `"routerDirection"` is `"forward"` or `"root"`.
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * The transition direction when navigating to another page.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  private onClick = () => {
    return navLink(this.el, this.routerDirection, this.component, this.componentProps);
  }

  render() {
    return (
      <Host onClick={this.onClick}></Host>
    );
  }
}

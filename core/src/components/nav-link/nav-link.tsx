import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';

import type { AnimationBuilder, ComponentProps } from '../../interface';
import type { NavComponent } from '../nav/nav-interface';
import type { RouterDirection } from '../router/utils/interface';

import { navLink } from './nav-link-utils';

@Component({
  tag: 'ion-nav-link',
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

  /**
   * The transition animation when navigating to another page.
   */
  @Prop() routerAnimation?: AnimationBuilder;

  private onClick = () => {
    return navLink(this.el, this.routerDirection, this.component, this.componentProps, this.routerAnimation);
  };

  render() {
    return <Host onClick={this.onClick}></Host>;
  }
}

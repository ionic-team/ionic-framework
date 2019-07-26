import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';
import { RouterDirection } from '../router/utils/interface';

@Component({
  tag: 'ion-nav-link'
})
export class NavLink implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * Component to navigate to. Only used if the `routerDirection` is `forward` or `root`.
   */
  @Prop() component?: NavComponent;

  /**
   * Data you want to pass to the component as props. Only used if the `routerDirection` is `forward` or `root`.
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * It specifies the transition direction when navigating to another page.
   */
  @Prop() routerDirection: RouterDirection = 'forward';

  private onClick = () => {
    const nav = this.el.closest('ion-nav');
    const { component, routerDirection } = this;
    if (nav) {
      if (routerDirection === 'forward') {
        if (component !== undefined) {
          nav.push(component, this.componentProps, { skipIfBusy: true });
        }
      } else if (routerDirection === 'root') {
        if (component !== undefined) {
          nav.setRoot(component, this.componentProps, { skipIfBusy: true });
        }
      } else if (routerDirection === 'back') {
        nav.pop({ skipIfBusy: true });
      }
    }
  }

  render() {
    return (
      <Host onClick={this.onClick}></Host>
    );
  }
}

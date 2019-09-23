import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';
import { navLink } from '../nav-link/nav-link-utils';

/**
 * @deprecated Use `<ion-nav-link component="MyComponent" routerDirection="root">` instead.
 */
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

  componentDidLoad() {
    console.warn('[DEPRECATED][ion-nav-set-root] `<ion-nav-set-root component="MyComponent">` is deprecated. Use `<ion-nav-link component="MyComponent" routerDirection="root">` instead.');
  }

  private setRoot = () => {
    return navLink(this.el, 'root', this.component, this.componentProps);
  }

  render() {
    return (
      <Host onClick={this.setRoot}></Host>
    );
  }
}

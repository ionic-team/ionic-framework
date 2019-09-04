import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { ComponentProps, NavComponent } from '../../interface';
import { navLink } from '../nav-link/nav-link-utils';

/**
 * @deprecated Use `<ion-nav-link component="MyComponent">` instead.
 */
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

  componentDidLoad() {
    console.warn('[DEPRECATED][ion-nav-push] `<ion-nav-push component="MyComponent">` is deprecated. Use `<ion-nav-link component="MyComponent">` instead.');
  }

  private push = () => {
    return navLink(this.el, 'forward', this.component, this.componentProps);
  }

  render() {
    return (
      <Host onClick={this.push}></Host>
    );
  }
}

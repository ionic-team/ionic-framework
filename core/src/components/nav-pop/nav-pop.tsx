import { Component, ComponentInterface, Element, Host, h } from '@stencil/core';

import { navLink } from '../nav-link/nav-link-utils';

/**
 * @deprecated Use `<ion-nav-link routerDirection="back">` instead.
 */
@Component({
  tag: 'ion-nav-pop',
})
export class NavPop implements ComponentInterface {

  @Element() el!: HTMLElement;

  componentDidLoad() {
    console.warn('[DEPRECATED][ion-nav-pop] <ion-nav-pop> is deprecated. Use `<ion-nav-link routerDirection="back">` instead.');
  }

  private pop = () => {
    return navLink(this.el, 'back');
  }

  render() {
    return (
      <Host onClick={this.pop}></Host>
    );
  }
}

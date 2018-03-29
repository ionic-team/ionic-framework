import { Component, Element, Listen, Prop } from '@stencil/core';
import { ComponentProps } from '../..';
import { NavComponent } from '../nav/nav-util';

@Component({
  tag: 'ion-nav-set-root',
})
export class NavSetRoot {

  @Element() el: HTMLElement;
  @Prop() component: NavComponent;
  @Prop() componentProps: ComponentProps;
  @Prop() url: string;

  @Listen('child:click')
  push(): Promise<any> {
    const nav = this.el.closest('ion-nav');
    if (nav) {
      const toPush = this.url || this.component;
      return nav.setRoot(toPush, this.componentProps);
    }
    return Promise.resolve(null);
  }

}

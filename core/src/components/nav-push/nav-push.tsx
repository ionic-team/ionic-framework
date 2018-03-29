import { Component, Element, Listen, Prop } from '@stencil/core';
import { ComponentProps } from '../..';
import { NavComponent } from '../nav/nav-util';

@Component({
  tag: 'ion-nav-push',
})
export class NavPush {

  @Element() el: HTMLElement;
  @Prop() component: NavComponent;
  @Prop() componentProps: ComponentProps;
  @Prop() url: string;

  @Listen('child:click')
  push(): Promise<any> {
    const nav = this.el.closest('ion-nav');
    const toPush = this.url || this.component;
    if (nav && toPush) {
      return nav.push(toPush, this.componentProps);
    }
    return Promise.resolve(null);
  }

}

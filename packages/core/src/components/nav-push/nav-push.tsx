import { Component, Element, Listen, Prop } from '@stencil/core';
// import { NavResult } from '../../index';

@Component({
  tag: 'ion-nav-push',
})
export class NavPush {

  @Element() el: HTMLElement;
  @Prop() component: any;
  @Prop() url: string;
  @Prop() data: any;

  @Listen('child:click')
  push(): Promise<any> {
    const nav = this.el.closest('ion-nav');
    if (nav) {
      const toPush = this.url || this.component;
      return nav.push(toPush, this.data);
    }
    return Promise.resolve(null);
  }

}

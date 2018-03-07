import { Component, Element, Listen, Prop } from '@stencil/core';
// import { NavResult } from '../../index';

@Component({
  tag: 'ion-nav-push',
})
export class NavPush {

  @Element() element: HTMLElement;
  @Prop() component: any;
  @Prop() url: string;
  @Prop() data: any;

  @Listen('child:click')
  push(): Promise<any> {
    const nav = this.element.closest('ion-nav') as HTMLIonNavElement;
    if (nav) {
      const toPush = this.url || this.component;
      return nav.push(toPush, this.data);
    }
    return Promise.resolve(null);
  }

}

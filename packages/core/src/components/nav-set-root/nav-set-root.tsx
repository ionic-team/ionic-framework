import { Component, Element, Listen, Prop } from '@stencil/core';

@Component({
  tag: 'ion-nav-set-root',
})
export class NavSetRoot {

  @Element() element: HTMLElement;
  @Prop() component: any;
  @Prop() url: string;
  @Prop() data: any;

  @Listen('child:click')
  push(): Promise<any> {
    const nav = this.element.closest('ion-nav');
    if (nav) {
      const toPush = this.url || this.component;
      return nav.setRoot(toPush, this.data);
    }
    return Promise.resolve(null);
  }

}

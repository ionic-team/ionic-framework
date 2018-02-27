import { Component, Element, Listen } from '@stencil/core';

@Component({
  tag: 'ion-nav-pop',
})
export class NavPop {

  @Element() element: HTMLElement;

  @Listen('child:click')
  pop(): Promise<any> {
    const nav = this.element.closest('ion-nav') as HTMLIonNavElement;
    if (nav) {
      return nav.pop();
    }
    return Promise.resolve(null);
  }

  render() {
    return <slot></slot>;
  }

}

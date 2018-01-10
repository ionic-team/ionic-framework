import { Component, Element, Prop, Watch } from '@stencil/core';


@Component({
  tag: 'ion-fab-list',
  styleUrl: 'fab-list.scss'
})
export class FabList {
  @Element() private el: HTMLIonFabElement;

  @Prop() activated = false;

  @Watch('activated')
  protected activatedChanged(activated: boolean) {
    const fabs = this.el.querySelectorAll('ion-fab-button');

    // if showing the fabs add a timeout, else show immediately
    let timeout = activated ? 30 : 0;
    for (let i = 0; i < fabs.length; i++) {
      const fab = fabs[i];
      setTimeout(() => fab.show = activated, i * timeout);
    }
  }

  hostData() {
    return {
      class: {
        'fab-list-active': this.activated
      }
    };
  }

  render() {
    return (
      <slot></slot>
    );
  }
}

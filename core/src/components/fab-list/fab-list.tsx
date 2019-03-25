import { Component, ComponentInterface, Element, Prop, Watch } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-fab-list',
  styleUrl: 'fab-list.scss',
  shadow: true
})
export class FabList implements ComponentInterface {
  mode!: Mode;

  @Element() el!: HTMLIonFabElement;

  /**
   * If `true`, the fab list will be show all fab buttons in the list.
   */
  @Prop() activated = false;

  @Watch('activated')
  protected activatedChanged(activated: boolean) {
    const fabs = Array.from(this.el.querySelectorAll('ion-fab-button'));

    // if showing the fabs add a timeout, else show immediately
    const timeout = activated ? 30 : 0;
    fabs.forEach((fab, i) => {
      setTimeout(() => fab.show = activated, i * timeout);
    });
  }

  /**
   * The side the fab list will show on relative to the main fab button.
   */
  @Prop() side: 'start' | 'end' | 'top' | 'bottom' = 'bottom';

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,
        'fab-list-active': this.activated,
        [`fab-list-side-${this.side}`]: true
      }
    };
  }

  render() {
    return <slot></slot>;
  }

}

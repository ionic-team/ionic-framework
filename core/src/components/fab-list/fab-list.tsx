import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-fab-list',
  styleUrl: 'fab-list.scss',
  shadow: true,
})
export class FabList implements ComponentInterface {
  @Element() el!: HTMLIonFabElement;

  /**
   * If `true`, the fab list will show all fab buttons in the list.
   */
  @Prop() activated = false;

  @Watch('activated')
  protected activatedChanged(activated: boolean) {
    const fabs = Array.from(this.el.querySelectorAll('ion-fab-button'));

    // if showing the fabs add a timeout, else show immediately
    const timeout = activated ? 30 : 0;
    fabs.forEach((fab, i) => {
      setTimeout(() => (fab.show = activated), i * timeout);
    });
  }

  /**
   * The side the fab list will show on relative to the main fab button.
   */
  @Prop() side: 'start' | 'end' | 'top' | 'bottom' = 'bottom';

  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,
          'fab-list-active': this.activated,
          [`fab-list-side-${this.side}`]: true,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

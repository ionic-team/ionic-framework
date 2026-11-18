import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { win } from '@utils/browser';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-fab-list',
  styleUrl: 'fab-list.scss',
  shadow: true,
})
export class FabList implements ComponentInterface {
  @Element() el!: HTMLIonFabElement;
  private activateTimeouts: ReturnType<typeof setTimeout>[] = [];

  /**
   * If `true`, the fab list will show all fab buttons in the list.
   */
  @Prop() activated = false;

  @Watch('activated')
  protected activatedChanged(activated: boolean) {
    this.activateTimeouts.forEach(clearTimeout);
    this.activateTimeouts = [];

    const fabs = Array.from(this.el.querySelectorAll('ion-fab-button'));

    const timeout = activated && this.shouldAnimate() ? 30 : 0;
    fabs.forEach((fab, i) => {
      this.activateTimeouts.push(setTimeout(() => (fab.show = activated), i * timeout));
    });
  }

  /**
   * The side the fab list will show on relative to the main fab button.
   */
  @Prop() side: 'start' | 'end' | 'top' | 'bottom' = 'bottom';

  /**
   * If `true`, the fab buttons in the list will show one at a time
   * when the list opens. Inside an `ion-fab`, this is ignored and the
   * main fab button's `animated` is used instead.
   */
  @Prop() animated = true;

  disconnectedCallback() {
    this.activateTimeouts.forEach(clearTimeout);
    this.activateTimeouts = [];
  }

  private shouldAnimate() {
    if (!this.animated || !config.getBoolean('animated', true)) {
      return false;
    }

    return !win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  render() {
    const mode = getIonMode(this);
    return (
      <Host
        class={{
          [mode]: true,
          'fab-list-active': this.activated,
          [`fab-list-side-${this.side}`]: true,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

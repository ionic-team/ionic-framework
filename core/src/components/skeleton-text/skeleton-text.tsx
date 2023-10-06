import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { hostContext } from '@utils/theme';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-skeleton-text',
  styleUrl: 'skeleton-text.scss',
  shadow: true,
})
export class SkeletonText implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * If `true`, the skeleton text will animate.
   */
  @Prop() animated = false;

  render() {
    const { el } = this;
    const animated = this.animated && config.getBoolean('animated', true);
    const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          [mode]: true,
          'skeleton-text-animated': animated,
          'in-media': inMedia,
          'in-item': hostContext('ion-item', el),
        }}
      >
        <span>&nbsp;</span>
      </Host>
    );
  }
}

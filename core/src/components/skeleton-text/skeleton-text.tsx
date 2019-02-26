import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Config } from '../../interface';
import { hostContext } from '../../utils/theme';

@Component({
  tag: 'ion-skeleton-text',
  styleUrl: 'skeleton-text.scss',
  shadow: true
})
export class SkeletonText implements ComponentInterface {

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;

  /**
   * If `true`, the skeleton text will animate.
   */
  @Prop() animated = false;

  /**
   * Width for the element to render at.
   */
  @Prop() width = '100%';

  render() {
    return (
      <span>&nbsp;</span>
    );
  }

  hostData() {
    const animated = this.animated && this.config.getBoolean('animated', true);
    const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);

    return {
      class: {
        'skeleton-text-animated': animated,
        'in-media': inMedia
      },
      style: {
        width: this.width
      }
    };
  }
}

import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Config } from '../../interface';

@Component({
  tag: 'ion-skeleton-text',
  styleUrl: 'skeleton-text.scss',
  shadow: true
})
export class SkeletonText implements ComponentInterface {

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

    return {
      class: {
        'skeleton-text-animated': animated
      },
      style: {
        width: this.width
      }
    };
  }
}

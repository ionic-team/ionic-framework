import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Config, Mode } from '../../interface';
import { hostContext } from '../../utils/theme';

@Component({
  tag: 'ion-skeleton-text',
  styleUrl: 'skeleton-text.scss',
  shadow: true
})
export class SkeletonText implements ComponentInterface {
  mode!: Mode;

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;

  /**
   * If `true`, the skeleton text will animate.
   */
  @Prop() animated = false;

  /**
   * @deprecated - Use CSS instead. The width of the skeleton text. If supplied, it will override the CSS style.
   */
  @Prop() width?: string;

  calculateWidth() {
    // If width was passed in to the property use that first
    if (this.width !== undefined) {
      return {
        style: {
          width: this.width
        }
      };
    }

    return;
  }

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
        [`${this.mode}`]: true,
        'skeleton-text-animated': animated,
        'in-media': inMedia
      },
      ...this.calculateWidth()
    };
  }
}

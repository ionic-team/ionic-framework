import { Component, ComponentInterface, Element, Prop, h } from '@stencil/core';

import { getContext } from '../../global/context';
import { hostContext } from '../../utils/theme';

@Component({
  tag: 'ion-skeleton-text',
  styleUrl: 'skeleton-text.scss',
  shadow: true
})
export class SkeletonText implements ComponentInterface {

  private config = getContext(this, 'config');

  @Element() el!: HTMLElement;

  /**
   * If `true`, the skeleton text will animate.
   */
  @Prop() animated = false;

  /**
   * The width of the skeleton text. If supplied, it will override the CSS style.
   * @deprecated Use CSS instead.
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
        'skeleton-text-animated': animated,
        'in-media': inMedia
      },
      ...this.calculateWidth()
    };
  }
}

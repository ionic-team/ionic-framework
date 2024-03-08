import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Prop, h } from '@stencil/core';
import { hostContext } from '@utils/theme';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import type { StyleEventDetail } from '../../interface';

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

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  componentWillLoad() {
    this.emitStyle();
  }

  private emitStyle() {
    // The emitted property is used by item in order
    // to add the item-skeleton-text class which applies
    // overflow: hidden to its label
    const style: StyleEventDetail = {
      'skeleton-text': true,
    };

    this.ionStyle.emit(style);
  }

  render() {
    const animated = this.animated && config.getBoolean('animated', true);
    const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
    const mode = getIonMode(this);

    return (
      <Host
        class={{
          [mode]: true,
          'skeleton-text-animated': animated,
          'in-media': inMedia,
        }}
      >
        <span>&nbsp;</span>
      </Host>
    );
  }
}

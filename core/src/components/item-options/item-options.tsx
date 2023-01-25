import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, h } from '@stencil/core';

import { getIonStylesheet } from '../../global/ionic-global';
import { isEndSide } from '../../utils/helpers';
import type { Side } from '../menu/menu-interface';

/**
 * @virtualProp {true | false} useBase - useBase determines if base components is enabled.
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-item-options',
  styleUrls: {
    base: 'item-options.scss',
    ios: 'item-options.ios.scss',
    md: 'item-options.md.scss',
  },
})
export class ItemOptions implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The side the option button should be on. Possible values: `"start"` and `"end"`. If you have multiple `ion-item-options`, a side must be provided for each.
   *
   */
  @Prop() side: Side = 'end';

  /**
   * Emitted when the item has been fully swiped.
   */
  @Event() ionSwipe!: EventEmitter<any>; // TODO(FW-2832): type

  /** @internal */
  @Method()
  async fireSwipeEvent() {
    this.ionSwipe.emit({
      side: this.side,
    });
  }

  render() {
    const mode = getIonStylesheet(this);
    const isEnd = isEndSide(this.side);
    return (
      <Host
        class={{
          [mode]: true,

          // Used internally for styling
          [`item-options-${mode}`]: true,

          'item-options-start': !isEnd,
          'item-options-end': isEnd,
        }}
      ></Host>
    );
  }
}

import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, h } from '@stencil/core';
import { isEndSide } from '@utils/helpers';

import { getIonMode } from '../../global/ionic-global';
import type { Side } from '../menu/menu-interface';

@Component({
  tag: 'ion-item-options',
  styleUrls: {
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
    const mode = getIonMode(this);
    const isEnd = isEndSide(this.side);
    return (
      <Host
        class={{
          [mode]: true,

          // Used internally for styling
          [`item-options-${mode}`]: true,

          /**
           * TODO FW-4816
           * Note: The "start" and "end" terms
           * in "item-options-*" are misleading because they
           * are used as "left" and "right" instead of
           * logical values. For example, if an app is in RTL
           * <ion-item-options side="end"> will always receive
           * the "item-options-end" class even though the end edge
           * in RTL is the left side of the screen.
           */
          'item-options-start': !isEnd,
          'item-options-end': isEnd,
        }}
      ></Host>
    );
  }
}

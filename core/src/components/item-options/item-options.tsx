import type {
  ComponentInterface,
  EventEmitter,
} from '@stencil/core';
import {
  Component,
  Element,
  Event,
  Host,
  Method,
  Prop,
  h,
} from '@stencil/core';
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
export class ItemOptions
  implements ComponentInterface
{
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
          [`item-options-${mode}`]:
            true,

          /**
           * Note: The "start" and "end" terms refer to the
           * direction ion-item-option instances within ion-item-options flow.
           * They do not refer to how ion-item-options flows within ion-item-sliding.
           * As a result, "item-options-start" means the ion-item-options container
           * always appears on the left, and "item-options-end" means the ion-item-options
           * container always appears on the right.
           */
          'item-options-start': !isEnd,
          'item-options-end': isEnd,
        }}
      ></Host>
    );
  }
}

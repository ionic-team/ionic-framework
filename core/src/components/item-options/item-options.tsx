import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Side } from '../../interface';
import { isEndSide } from '../../utils/helpers';

@Component({
  tag: 'ion-item-options',
  styleUrls: {
    ios: 'item-options.ios.scss',
    md: 'item-options.md.scss'
  }
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
  @Event() ionSwipe!: EventEmitter<any>;

  /** @internal */
  @Method()
  async fireSwipeEvent() {
    this.ionSwipe.emit({
      side: this.side
    });
  }

  hostData() {
    const mode = getIonMode(this);
    const isEnd = isEndSide(this.side);

    return {
      class: {
        [mode]: true,

        // Used internally for styling
        [`item-options-${mode}`]: true,

        'item-options-start': !isEnd,
        'item-options-end': isEnd
      }
    };
  }
}

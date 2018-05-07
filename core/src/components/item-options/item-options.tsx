import { Component, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';
import { Side, isEndSide } from '../../utils/helpers';


@Component({
  tag: 'ion-item-options',
  styleUrls: {
    ios: 'item-options.ios.scss',
    md: 'item-options.md.scss'
  },
  host: {
    theme: 'item-options'
  }
})
export class ItemOptions {
  @Element() el!: HTMLElement;

  @Prop({ context: 'window' }) win!: Window;

  /**
   * The side the option button should be on.
   * Possible values: `"start"` and `"end"`.
   * Defaults to `"end"`.
   * If you have multiple `ion-item-options`, a side must be provided for each.
   */
  @Prop() side: Side = 'end';

  /**
   * Emitted when the item has been fully swiped.
   */
  @Event() ionSwipe!: EventEmitter<void>;

  @Method()
  isEndSide() {
    return isEndSide(this.win, this.side);
  }

  @Method()
  width(): number {
    return this.el.offsetWidth;
  }

  @Method()
  fireSwipeEvent() {
    this.ionSwipe.emit();
  }

  hostData() {
    return {
      class: {
        'item-options-start': !this.isEndSide(),
        'item-options-end': this.isEndSide()
      }
    };
  }

}

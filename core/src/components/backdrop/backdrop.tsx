import { Component, ComponentInterface, Event, EventEmitter, Listen, Prop } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { GESTURE_CONTROLLER } from '../../utils/gesture';
import { now } from '../../utils/helpers';

@Component({
  tag: 'ion-backdrop',
  styleUrls: {
    ios: 'backdrop.ios.scss',
    md: 'backdrop.md.scss'
  },
  shadow: true
})
export class Backdrop implements ComponentInterface {

  private lastClick = -10000;
  private blocker = GESTURE_CONTROLLER.createBlocker({
    disableScroll: true
  });

  /**
   * If `true`, the backdrop will be visible.
   */
  @Prop() visible = true;

  /**
   * If `true`, the backdrop will can be clicked and will emit the `ionBackdropTap` event.
   */
  @Prop() tappable = true;

  /**
   * If `true`, the backdrop will stop propagation on tap.
   */
  @Prop() stopPropagation = true;

  /**
   * Emitted when the backdrop is tapped.
   */
  @Event() ionBackdropTap!: EventEmitter<void>;

  componentDidLoad() {
    if (this.stopPropagation) {
      this.blocker.block();
    }
  }

  componentDidUnload() {
    this.blocker.destroy();
  }

  @Listen('touchstart', { passive: false, capture: true })
  protected onTouchStart(ev: TouchEvent) {
    this.lastClick = now(ev);
    this.emitTap(ev);
  }

  @Listen('click', { passive: false, capture: true })
  @Listen('mousedown', { passive: false, capture: true })
  protected onMouseDown(ev: TouchEvent) {
    if (this.lastClick < now(ev) - 2500) {
      this.emitTap(ev);
    }
  }

  private emitTap(ev: Event) {
    if (this.stopPropagation) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    if (this.tappable) {
      this.ionBackdropTap.emit();
    }
  }

  hostData() {
    const mode = getIonMode(this);

    return {
      tabindex: '-1',
      class: {
        [mode]: true,
        'backdrop-hide': !this.visible,
        'backdrop-no-tappable': !this.tappable,
      }
    };
  }
}

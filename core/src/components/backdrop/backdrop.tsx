import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Event, Host, Listen, Prop, h } from '@stencil/core';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-backdrop',
  styleUrl: 'backdrop.scss',
  shadow: true,
})
export class Backdrop implements ComponentInterface {
  /**
   * If `true`, the backdrop will be visible.
   * This property controls whether or not the backdrop's
   * default background is shown. It does not control whether
   * or not the backdrop blocks interaction, and it does not
   * override a custom background set on `ion-backdrop`.
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

  @Listen('click', { passive: false, capture: true })
  protected onClick(ev: MouseEvent) {
    this.emitTap(ev);
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

  render() {
    const { tappable, visible } = this;

    return (
      <Host
        aria-hidden="true"
        class={{
          'backdrop-hide': !visible,
          'backdrop-no-tappable': !tappable,
        }}
      ></Host>
    );
  }
}

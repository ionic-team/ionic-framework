import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true,
})
export class Grid implements ComponentInterface {
  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   *
   * The width each breakpoint activates at can be changed with the
   * `screenBreakpoints` config. The default widths assume the default
   * thresholds, so lowering a threshold without lowering its width leaves the
   * grid clamped by `max-width: 100%` and no longer fixed. Set the matching
   * `--ion-grid-breakpoint-*-width` variables alongside the config.
   */
  @Prop() fixed = false;

  render() {
    return (
      <Host
        class={{
          'grid-fixed': this.fixed,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

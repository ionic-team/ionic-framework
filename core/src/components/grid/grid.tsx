import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, forceUpdate, h } from '@stencil/core';
import { getActiveBreakpoint, onBreakpointChange } from '@utils/breakpoints';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-grid',
  styleUrl: 'grid.scss',
  shadow: true,
})
export class Grid implements ComponentInterface {
  private unsubscribeBreakpoint?: () => void;

  /**
   * If `true`, the grid will have a fixed width based on the screen size.
   */
  @Prop() fixed = false;

  connectedCallback() {
    this.unsubscribeBreakpoint = onBreakpointChange(() => forceUpdate(this));
  }

  disconnectedCallback() {
    this.unsubscribeBreakpoint?.();
    this.unsubscribeBreakpoint = undefined;
  }

  render() {
    return (
      <Host
        screen-breakpoint={getActiveBreakpoint()}
        class={{
          'grid-fixed': this.fixed,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

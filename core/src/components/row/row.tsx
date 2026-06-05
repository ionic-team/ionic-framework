import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-row',
  styleUrl: 'row.scss',
  shadow: true,
})
export class Row implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

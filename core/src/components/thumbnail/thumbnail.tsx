import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 */
@Component({
  tag: 'ion-thumbnail',
  styleUrl: 'thumbnail.scss',
  shadow: true,
})
export class Thumbnail implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

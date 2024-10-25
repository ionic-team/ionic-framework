import type { ComponentInterface } from '@stencil/core';
import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ion-segment-content',
  styleUrls: {
    ios: 'segment-content.ios.scss',
    md: 'segment-content.md.scss',
  },
  shadow: true,
})
export class SegmentContent implements ComponentInterface {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}

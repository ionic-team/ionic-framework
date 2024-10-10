import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'ion-segment-content',
  styleUrls: {
    ios: 'segment-content.ios.scss',
    md: 'segment-content.md.scss',
  },
  shadow: true,
})
export class SegmentContent implements ComponentInterface {
  /**
   * If `true`, the segment content will not be displayed.
   */
  @Prop() disabled = false;

  render() {
    const { disabled } = this;

    return (
      <Host
        class={{
          'segment-content-disabled': disabled,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

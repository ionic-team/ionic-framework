import { Component, ComponentInterface, Host, Prop, getMode, h } from '@stencil/core';

import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  }
})
export class Header implements ComponentInterface {

  private mode = getMode<Mode>(this);

  /**
   * If `true`, the header will be translucent.
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  render() {
    const themedClasses = createThemedClasses(this.mode, 'header');
    const translucentClasses = this.translucent ? createThemedClasses(this.mode, 'header-translucent') : null;

    return (
      <Host
        class={{
          ...themedClasses,
          ...translucentClasses
        }}
      >
      </Host>
    );
  }
}

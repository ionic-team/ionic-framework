import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-avatar',
  styleUrls: {
    ios: 'avatar.ios.scss',
    md: 'avatar.md.scss',
    ionic: 'avatar.ionic.scss',
  },
  shadow: true,
})
export class Avatar implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * Set to `"small"` for a compact size, `"medium"` for the default height and width, or to
   * `"large"` for a larger size.
   *
   * Defaults to `"medium"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() size?: 'small' | 'medium' | 'large';

  get hasImage() {
    return !!this.el.querySelector('ion-img') || !!this.el.querySelector('img');
  }

  private getSize(): string | undefined {
    const theme = getIonTheme(this);
    const { size } = this;

    // TODO(ROU-10752): Remove theme check when sizes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (size === undefined) {
      return 'medium';
    }

    return size;
  }

  render() {
    const theme = getIonTheme(this);
    const size = this.getSize();

    return (
      <Host
        class={{
          [theme]: true,
          [`avatar-${size}`]: size !== undefined,
          [`avatar-image`]: this.hasImage,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

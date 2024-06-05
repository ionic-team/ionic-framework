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
   * Set to `"xsmall"` for the smallest size, `"small"` for a compact size, `"medium"`
   * for the default height and width, `"large"` for a larger size, or `"xlarge"` for
   * the largest dimensions.
   *
   * Defaults to `"medium"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() size?: `xsmall` | 'small' | 'medium' | 'large' | 'xlarge';

  /**
   * Set to `"soft"` for an avatar with slightly rounded corners,
   * `"round"` for an avatar with fully rounded corners, or `"rectangular"`
   * for an avatar without rounded corners.
   *
   * Defaults to `"round"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular';

  get hasImage() {
    return !!this.el.querySelector('ion-img') || !!this.el.querySelector('img');
  }

  get hasIcon() {
    return !!this.el.querySelector('ion-icon');
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

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-10755): Remove theme check when shapes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (shape === undefined) {
      return 'round';
    }

    return shape;
  }

  render() {
    const theme = getIonTheme(this);
    const size = this.getSize();
    const shape = this.getShape();

    return (
      <Host
        class={{
          [theme]: true,
          [`avatar-${size}`]: size !== undefined,
          [`avatar-${shape}`]: shape !== undefined,
          [`avatar-image`]: this.hasImage,
          [`avatar-icon`]: this.hasIcon,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

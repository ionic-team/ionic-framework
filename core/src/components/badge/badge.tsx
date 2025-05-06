import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.ios.scss',
    md: 'badge.md.scss',
    ionic: 'badge.ionic.scss',
  },
  shadow: true,
})
export class Badge implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"bold"` for a badge with vibrant, bold colors or to `"subtle"` for
   * a badge with muted, subtle colors.
   *
   * Only applies to the `ionic` theme.
   */
  @Prop() hue?: 'bold' | 'subtle';

  /**
   * Set to `"rectangular"` for non-rounded corners.
   * Set to `"soft"` for slightly rounded corners.
   * Set to `"round"` for fully rounded corners.
   *
   * Defaults to `"round"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft' | 'round | rectangular';

  /**
   * Set to `"small"` for a small badge.
   * Set to `"medium"` for a medium badge.
   * Set to `"large"` for a large badge, when it is empty (no text or icon).
   *
   * Defaults to `"small"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() size?: 'small' | 'medium' | 'large';

  /**
   * Set to `"top"` to position the badge on top right absolute position of the parent element.
   * Set to `"bottom"` to position the badge on bottom right absolute position of the parent element.
   */
  @Prop() vertical?: 'top' | 'bottom';

  private getShape(): string | undefined {
    const theme = getIonTheme(this);
    const { shape } = this;

    // TODO(ROU-10777): Remove theme check when shapes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (shape === undefined) {
      return 'round';
    }

    return shape;
  }

  private getSize(): string | undefined {
    const theme = getIonTheme(this);
    const { size } = this;

    // TODO(ROU-10747): Remove theme check when sizes are defined for all themes.
    if (theme !== 'ionic') {
      return undefined;
    }

    if (size === undefined) {
      return 'small';
    }

    return size;
  }

  // The 'subtle' hue is the default for badges containing text or icons
  // The 'bold' hue is used when inside of an avatar, button, tab button,
  // or when the badge is empty (no text or icon).
  private getHue(): string | undefined {
    const { hue } = this;

    if (hue !== undefined) {
      return hue;
    }

    const inAvatar = hostContext('ion-avatar', this.el);
    const inButton = hostContext('ion-button', this.el);
    const inTabButton = hostContext('ion-tab-button', this.el);
    const hasContent = this.el.textContent?.trim() !== '' || this.el.querySelector('ion-icon') !== null;

    // Return 'bold' if the badge is inside an avatar, button, tab button,
    // or has no content
    if (inAvatar || inButton || inTabButton || !hasContent) {
      return 'bold';
    }

    // Return 'subtle' if the badge contains visible text or an icon
    return 'subtle';
  }

  render() {
    const hue = this.getHue();
    const shape = this.getShape();
    const size = this.getSize();
    const theme = getIonTheme(this);

    return (
      <Host
        class={createColorClasses(this.color, {
          [theme]: true,
          [`badge-${hue}`]: hue !== undefined,
          [`badge-${shape}`]: shape !== undefined,
          [`badge-${size}`]: size !== undefined,
          [`badge-vertical-${this.vertical}`]: this.vertical !== undefined,
          'in-button': hostContext('ion-button', this.el),
          'in-tab-button': hostContext('ion-tab-button', this.el),
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}

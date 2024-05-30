import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

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
  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Set to `"soft"` for slightly rounded corners.
   * Defaults to `"round"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() shape?: 'soft';

  /**
   * Set to "xsmall" for even less height and width. Set to `"small"` for less height and width. Set to "medium" for slightly larger dimensions. Set to "large" for even greater height and width. Set to `"xlarge"` for the largest badge.
   * Defaults to `"small"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop() size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

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

  render() {
    const shape = this.getShape();
    const size = this.getSize();
    const theme = getIonTheme(this);
    return (
      <Host
        class={createColorClasses(this.color, {
          [theme]: true,
          [`badge-${shape}`]: shape !== undefined,
          [`badge-${size}`]: size !== undefined,
        })}
      >
        <slot></slot>
      </Host>
    );
  }
}

import { getIonTheme } from '@global/ionic-global';
import type { ComponentInterface } from '@stencil/core';
import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'ion-divider',
  styleUrls: {
    ios: 'divider.ios.scss',
    md: 'divider.md.scss',
    ionic: 'divider.ionic.scss',
  },
  shadow: true,
})
export class Divider implements ComponentInterface {
  /**
   * Set to `"xxsmall"` for the smallest spacing.
   * Set to "xsmall" for very small spacing.
   * Set to `"small"` for small spacing.
   * Set to "medium" for medium spacing.
   * Set to "large" for large spacing.
   * Set to `"xlarge"` for the largest spacing.
   *
   * Defaults to `"xxsmall"`.
   */
  @Prop({ reflect: true }) spacing?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' =
    'xxsmall';

  /**
   * If `true`, the divider will have horizontal margins
   * By default, it's `false`
   */
  @Prop() inset: boolean = false;

  render() {
    const { inset, spacing } = this;
    const theme = getIonTheme(this);

    return (
      <Host
        class={{
          [theme]: true,
          [`divider-spacing-${spacing}`]: spacing !== undefined,
          [`divider-inset`]: inset,
        }}
      >
        <hr />
      </Host>
    );
  }
}

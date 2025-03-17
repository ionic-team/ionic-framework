import { getIonTheme } from '@global/ionic-global';
import type { ComponentInterface } from '@stencil/core';
import { Component, Prop, Host, h } from '@stencil/core';

@Component({
  tag: 'ion-divider',
  styleUrls: {
    ios: 'divider.scss',
    md: 'divider.scss',
    ionic: 'divider.scss',
  },
  shadow: true,
})
export class Divider implements ComponentInterface {

    /**
   * Set to `"xxsmall"` for the smallest spacing.
   * Set to "xsmall" for a very small spacing.
   * Set to `"small"` for a small spacing.
   * Set to "medium" for a medium spacing.
   * Set to "large" for a large spacing.
   * Set to `"xlarge"` for the largest spacing.
   *
   * Defaults to `"small"` for the `ionic` theme, undefined for all other themes.
   */
  @Prop({ reflect: true }) spacing?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

    /**
   * If `true`, the divider will have horizontal margins
   * By default, it's `false`
   */
  @Prop() inset?: boolean = false;

  private getSpacing(): string | undefined {
    const { spacing } = this;

    if (spacing === undefined) {
      return 'xxsmall';
    }

    return spacing;
  }

  render() {
    const theme = getIonTheme(this);
    const spacing = this.getSpacing();
    return (
      <Host
        class={{
          [theme]: true,
          [`divider-space-${spacing}`]: spacing !== undefined,
          [`divider-inset`]: this.inset || false,
        }}>
        <hr />
      </Host>
    );
  }
}

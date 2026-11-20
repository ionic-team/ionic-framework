import type { ComponentInterface } from '@stencil/core';
import { Component, Prop, Host, h } from '@stencil/core';

import { config } from '../../global/config';

import type { IonDividerSpacing } from './divider.interface';

@Component({
  tag: 'ion-divider',
  styleUrl: 'divider.scss',
  shadow: true,
})
export class Divider implements ComponentInterface {
  /**
   * Set to `"xxsmall"` for the smallest spacing.
   * Set to `"xsmall"` for very small spacing.
   * Set to `"small"` for small spacing.
   * Set to `"medium"` for medium spacing.
   * Set to `"large"` for large spacing.
   * Set to `"xlarge"` for very large spacing.
   * Set to `"xxlarge"` for the largest spacing.
   *
   * Defaults to `"medium"` if both the spacing property and theme config are unset.
   */
  @Prop({ reflect: true }) spacing?: IonDividerSpacing;

  /**
   * If `true`, the divider will have horizontal margins
   * By default, it's `false`
   */
  @Prop() inset: boolean = false;

  /**
   * Gets the divider spacing. Uses the `spacing` property if set, otherwise
   * checks the theme config. Defaults to `medium` if neither is set.
   */
  get spacingValue(): IonDividerSpacing {
    const spacingConfig = config.getObjectValue('IonDivider.spacing', 'medium') as IonDividerSpacing;

    return this.spacing ?? spacingConfig;
  }

  render() {
    const { inset, spacingValue } = this;

    return (
      <Host
        class={{
          [`divider-spacing-${spacingValue}`]: true,
          [`divider-inset`]: inset,
        }}
      >
        <hr />
      </Host>
    );
  }
}

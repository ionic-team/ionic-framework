import { Component, ComponentInterface, Host, Prop, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { Color, MedColor } from '../../interface';
import { generateMedColor } from '../../utils/med-theme';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-badge',
  styleUrls: {
    ios: 'badge.md.scss',
    md: 'badge.md.scss'
  },
  shadow: true
})
export class Badge implements ComponentInterface {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * Define a variação do componente.
   */
  @Prop({ reflect: true }) dsName?: 'secondary';

  /**
   * Define a variação de tamanho do componente.
   */
  @Prop({ reflect: true }) dsSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  render() {
    const { dsColor, dsName, dsSize } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={generateMedColor(dsColor, {
          [mode]: true,
          'med-badge': true,
          [`med-badge--${dsName}`]: dsName !== undefined,
          [`med-badge--${dsSize}`]: dsSize !== undefined,
        })}>
        <slot></slot>
      </Host>
    );
  }
}

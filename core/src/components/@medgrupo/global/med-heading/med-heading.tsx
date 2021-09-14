import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-heading',
  styleUrl: 'med-heading.scss',
  shadow: true,
})
export class MedHeading {

  /**
    * Define a cor do componente.
    */
   @Prop({ reflect: true }) dsColor?: MedColor;

   /**
   * Define a variação do componente.
   */
  @Prop({ reflect: true }) dsName?: 'high';

   /**
    * Define a variação de tamanho do componente.
    */
   @Prop({ reflect: true }) dsSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  render() {
    const { dsColor, dsName, dsSize } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-heading': true,
          [`med-heading--${dsName}`]: dsName !== undefined,
          [`med-heading--${dsSize}`]: dsSize !== undefined,
        })}>
        <slot></slot>
      </Host>
    );
  }

}

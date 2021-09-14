import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-subtitle',
  styleUrl: 'med-subtitle.scss',
  shadow: true,
})
export class MedSubtitle {

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
   @Prop({ reflect: true }) dsSize?: 'xxs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl';

  render() {
    const { dsColor, dsName, dsSize } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-subtitle': true,
          [`med-subtitle--${dsName}`]: dsName !== undefined,
          [`med-subtitle--${dsSize}`]: dsSize !== undefined,
        })}>
        <slot></slot>
      </Host>
    );
  }

}

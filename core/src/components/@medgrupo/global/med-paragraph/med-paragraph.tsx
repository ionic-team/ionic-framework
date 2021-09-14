import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-paragraph',
  styleUrl: 'med-paragraph.scss',
  shadow: true,
})
export class MedParagraph {

  /**
    * Define a cor do componente.
    */
   @Prop({ reflect: true }) dsColor?: MedColor;

   /**
   * Define a variação do componente.
   */
  @Prop({ reflect: true }) dsName?: 'double';

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
          'med-paragraph': true,
          [`med-paragraph--${dsName}`]: dsName !== undefined,
          [`med-paragraph--${dsSize}`]: dsSize !== undefined,
        })}>
        <slot></slot>
      </Host>
    );
  }

}

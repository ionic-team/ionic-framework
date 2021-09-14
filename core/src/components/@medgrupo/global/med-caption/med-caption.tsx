import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-caption',
  styleUrl: 'med-caption.scss',
  shadow: true,
})
export class MedCaption {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
    * Define a variação de tamanho do componente.
    */
  @Prop({ reflect: true }) dsSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  render() {
    const { dsColor, dsSize } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-caption': true,
          [`med-caption--${dsSize}`]: dsSize !== undefined,
        })}>
        <slot></slot>
      </Host>
    );
  }

}

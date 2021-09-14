import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-rate-bar',
  styleUrl: 'med-rate-bar.scss',
  shadow: true,
})
export class MedRateBar {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  render() {

    const { dsColor } = this;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-rate-bar': true,
        })}>
        <slot></slot>
        <slot name="avaliacao"></slot>
      </Host>
    );
  }

}

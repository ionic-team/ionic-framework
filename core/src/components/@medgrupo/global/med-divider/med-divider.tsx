import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-divider',
  styleUrl: 'med-divider.scss',
  shadow: true,
})
export class MedDivider {
  /**
   * Define a cor do componente.
   */
  @Prop() dsColor?: MedColor;

  /**
   * Define o texto do componente.
   */
  @Prop() text!: string;

  render() {
    const { dsColor, text } = this;

    return (
      <Host from-stencil class={generateMedColor(dsColor, {
        'med-divider': true
        })}>
        <h3 class="med-divider__heading">{text}</h3>
      </Host>
    );
  }

}

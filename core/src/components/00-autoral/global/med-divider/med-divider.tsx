import { Component, Host, h, Prop } from '@stencil/core';
import { Color, Neutral } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-divider',
  styleUrl: 'med-divider.scss',
  shadow: true,
})
export class MedDivider {
  /**
   * Define a cor do componente.
   */
  @Prop() color?: Color;

  /**
   * Define a cor neutra do componente.
   */
  @Prop() neutral?: Neutral;

  /**
   * Define o texto do componente.
   */
  @Prop() text!: string;

  render() {
    const { color, neutral, text } = this;

    return (
      <Host from-stencil class={createColorClasses(color, {
        'med-divider': true
        }, neutral)}>
        <h3 class="med-divider__heading">{text}</h3>
      </Host>
    );
  }

}

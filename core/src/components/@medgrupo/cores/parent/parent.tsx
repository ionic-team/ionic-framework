import { Component, Host, h, Prop } from '@stencil/core';
import { Color } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-parent',
  styleUrl: 'parent.scss',
  shadow: true,
})
export class Parent {
  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: Color;

  /**
    * Define o fill do componente.
    */
  @Prop({ reflect: true }) fill?: 'outline';

  /**
    * Teste.
    */
  @Prop({ reflect: true }) child = false;

  render() {
    const { dsColor, fill, child } = this;

    return (
      <Host class={generateMedColor(dsColor, {
        'med-parent': true,
        [`med-parent--${fill}`]: fill !== undefined,
        })}>
        <h3><slot></slot></h3>
        {child && <med-child class="med-parent__child"></med-child>}
      </Host>
    );
  }

}



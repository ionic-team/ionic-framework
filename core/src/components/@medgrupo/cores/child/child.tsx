import { Component, Host, h, Prop } from '@stencil/core';
import { Color } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-child',
  styleUrl: 'child.scss',
  shadow: true,
})
export class Child {
  /**
  * Define a cor do componente.
  */
  @Prop() dsColor?: Color;

  /**
    * Define o fill do componente.
    */
  @Prop({ reflect: true }) fill?: 'outline';


  render() {
    const { dsColor, fill } = this;

    return (
      <Host class={generateMedColor(dsColor, {
        'med-child': true,
        [`med-child_${fill}`]: fill !== undefined,
        })}>
        <h3><slot></slot></h3>
      </Host>
    );
  }

}

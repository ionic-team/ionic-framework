import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

@Component({
  tag: 'med-tiles',
  styleUrl: 'med-tiles.scss',
  shadow: true,
})
export class MedTiles {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
   * TODO
   */
  @Prop() titulo?: string;

  /**
   * TODO
   */
  @Prop() label?: string;

  /**
   * TODO
   */
  @Prop() badge?: string;

  /**
   * TODO
   */
  @Prop() solid = false;

  /**
   * TODO
   */
  @Prop({ reflect:true }) selected = false;

  render() {
    const { dsColor, titulo, label, selected, solid } = this;
    return (
      <Host
      class={generateMedColor(dsColor, {
        'med-tiles': true,
        'med-solid': solid,
        'med-tiles--selected': selected
      },)}
      >
        <div class="med-tiles__border"></div>
        <div class="med-tiles__content">
          <h3 class="med-tiles__title" innerHTML={titulo}></h3>
          <h4 class="med-tiles__label"  innerHTML={label}></h4>
          <slot></slot>
        </div>
      </Host>
    );
  }

}

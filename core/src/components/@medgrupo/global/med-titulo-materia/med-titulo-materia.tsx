import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';
@Component({
  tag: 'med-titulo-materia',
  styleUrl: 'med-titulo-materia.scss',
  shadow: true,
})
export class MedTituloMateria {

  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
    * Define o titulo do item.
    */
  @Prop() titulo?: string;

  /**
    * Define o descricao do item.
    */
  @Prop() descricao?: string;

  render() {

    const { dsColor, titulo, descricao } = this;

    return (
      <Host from-stencil
        class={generateMedColor(dsColor, {
          'med-titulo-materia': true,
        })}>
        <slot name="start"></slot>
        <div class="med-titulo-materia__content">
          <h3 class="med-titulo-materia__titulo">{titulo}</h3>
          <p class="med-titulo-materia__descricao">{descricao}</p>
        </div>
        <slot name="end"></slot>
      </Host>
    );
  }

}

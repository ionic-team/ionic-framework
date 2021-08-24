import { Component, Host, h, Prop } from '@stencil/core';
import { Color, Neutral } from '../../../../interface';
import { createColorClasses } from '../../../../utils/theme';
@Component({
  tag: 'med-titulo-materia',
  styleUrl: 'med-titulo-materia.scss',
  shadow: true,
})
export class MedTituloMateria {

  /**
    * Define a cor do componente.
    */
  @Prop() color?: Color;

  /**
    * Define a cor neutra do componente.
    */
  @Prop() neutral?: Neutral;

  /**
    * Define o titulo do item.
    */
  @Prop() titulo?: string;

  /**
    * Define o descricao do item.
    */
  @Prop() descricao?: string;

  render() {

    const { color, neutral, titulo, descricao } = this;

    return (
      <Host from-stencil
        class={createColorClasses(color, {
          'med-titulo-materia': true,
        }, neutral)}>
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

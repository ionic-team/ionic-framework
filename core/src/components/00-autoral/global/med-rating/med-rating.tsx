import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-rating',
  styleUrl: 'med-rating.scss',
  shadow: true,
})
export class MedRating {

  /**
   * Define a variação do componente.
   */
  @Prop() dsName?: 'medgrupo' | 'banca';

  /**
    * Define o nome do aluno.
    */
  @Prop() nome?: string;

  /**
    * Define a data da postagem.
    */
  @Prop() data?: string;

  /**
    * Define o nome do concurso.
    */
  @Prop() concurso?: string;

  /**
    * Define o conteúdo de texto.
    */
  @Prop() texto?: string;

  /**
  * Define o estado cabe ou não cabe recurso.
  */
  @Prop() cabe = false;

    render() {
      const { dsName, nome, data, concurso, texto, cabe } = this;

      return (
        <Host from-stencil
          class={createColorClasses(null, {
            'med-rating': true,
            'med-rating--cabe': cabe,
            'med-rating--nao-cabe': !cabe,
            [`med-rating--${dsName}`]: dsName !== undefined,
          }, null)}>

            <div class="med-rating__left">
              <ion-icon name={cabe ? "med-positivo" : "med-negativo"} class="med-icon med-rating__icon"></ion-icon>
            </div>

            <div class="med-rating__right">
              <span class="med-rating__name">{nome}</span> <span class="med-rating__date">{data}</span>
              <p class="med-rating__concurso">{concurso}</p>
              <span class="med-rating__text">{texto}</span>
              {(dsName === 'medgrupo') && <ion-icon name="med-logo" class="med-icon med-rating__icon-medgrupo"></ion-icon>}
            </div>

        </Host>
      );
    }

}

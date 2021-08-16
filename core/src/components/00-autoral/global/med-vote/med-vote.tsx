import { Component, Host, h, Prop } from '@stencil/core';
import { createColorClasses } from '../../../../utils/theme';

@Component({
  tag: 'med-vote',
  styleUrl: 'med-vote.scss',
  shadow: true,
})
export class MedVote {

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() titulo?: string;

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() cabe?: number;

  /**
    * Define o conteúdo de texto do componente.
    */
  @Prop() naoCabe?: number;

  public validarValores(_cabe:any,_naoCabe:any){
    let valueCabe = _cabe >= 0 && _cabe !== undefined && _cabe !== null ? _cabe : 0
    let valueNaoCabe = _naoCabe >= 0  && _naoCabe !== undefined && _naoCabe !== null ? _naoCabe : 0
    return {valueCabe,valueNaoCabe}
  }

  render() {
    const { titulo, cabe, naoCabe } = this;
    const {valueCabe,valueNaoCabe} = this.validarValores(cabe,naoCabe)
    const total = valueCabe + valueNaoCabe
    const cabeP = ((valueCabe*100)/total)
    const naoCabeP = ((valueNaoCabe*100)/total)
    return (
      <Host
        from-stencil
        class={createColorClasses(null, {
          'med-vote': true,
        }, null)}>
        <div class="med-vote__row">
          <div class="med-vote__icon-container">
            <ion-icon class="med-icon med-vote__icon med-vote__icon--cabe" name="med-positivo"></ion-icon>
            <div class="med-vote__badge med-vote__badge--cabe">{valueCabe}</div>
          </div>
          <h3 class="med-vote__heading" innerHTML={titulo}></h3>
          <div class="med-vote__icon-container">
            <div class="med-vote__badge med-vote__badge--nao-cabe">{valueNaoCabe}</div>
            <ion-icon class="med-icon med-vote__icon med-vote__icon--nao-cabe" name="med-negativo"></ion-icon>
          </div>
        </div>
        <div class="med-vote__row">
          <div class="med-vote__chart med-vote__chart--cabe" style={{ width: `${cabeP}%` }}></div>
          <div class="med-vote__chart med-vote__chart--nao-cabe" style={{ width: `${naoCabeP}%` }}></div>
        </div>
      </Host>
    );
  }

}

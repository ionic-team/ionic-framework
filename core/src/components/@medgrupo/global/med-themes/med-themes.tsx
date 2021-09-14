import { Component, Host, h, Prop, EventEmitter,Event } from '@stencil/core';
import { MedTema } from './med-themes-interface';
@Component({
  tag: 'med-themes',
  styleUrl: 'med-themes.scss',
  shadow: true,
})
export class MedThemes {
 /**
   * Define a variação do componente.
   */
  @Prop({ reflect: true }) ativo?: 'theme-gold' | 'theme-recursos' ;

 /**
   * Define quais os temas
   */
  @Prop({ reflect: true }) temas?: MedTema[];

  /**
   * Retornar a cor selecionada
   */
  @Event() medChange!: EventEmitter<string>;

  temaSelecionado(temaAtivo:any){
    this.ativo = temaAtivo;
    this.medChange.emit(this.ativo);
  }

  render() {
    const { temas } = this;

    return (
      <Host
        from-stencil>
        <ion-radio-group onIonChange = {ev => this.temaSelecionado(ev.detail.value)} value={this.ativo}>
          {temas?.map((tema:MedTema) => (
            <div class={`med-theme med-theme--${tema.value}`}>
              <div class="med-theme__left">
                <div class="med-theme__circle"></div>
              </div>
              <div class="med-theme__right">
                <div class="med-theme__bar"></div>
                <div class="med-theme__bar med-theme__bar--small"></div>
                <div class="med-theme__wrapper">
                  <ion-radio value={tema.value} class="med-theme__radio"></ion-radio>
                  <span class="med-theme__name">{tema.label}</span>
                </div>
              </div>
            </div>
            ))}
        </ion-radio-group>
      </Host>
    );
  }

}

import { Component, Host, h, Prop, Event, EventEmitter, State, Element, Listen, Watch } from '@stencil/core';
import { Color } from '../../../../../interface';
import { generateMedColor } from '../../../../../utils/med-theme';
import { MedAlternativasBase } from '../med-alternativas/med-alternativas-base';
import { MedAlternativaInterface, MedAlternativasInternoInterface } from '../med-alternativas/med-alternativas-interface';

@Component({
  tag: 'med-alternativas-b',
  styleUrl: 'med-alternativas-b.scss',
  shadow: true,
})
export class MedAlternativasB implements MedAlternativasInternoInterface {
  @Element() hostElement!: HTMLElement;

  /**
   * TODO
   */
  @Prop() dsColor?: Color;

  /**
   * TODO
   */
  @Prop() dsSkin?: any;

  /**
   * TODO
   */
  @Prop() dsSkinConfig?: any;

  /**
   * TODO
   */
  @Prop({ mutable: true }) alternativas: MedAlternativaInterface | any = [];

  /**
   * TODO
   */
  @Prop() keyAlternativa = 'Alternativa';

  /**
   * TODO
   */
  @Prop() keyEnunciado = 'Enunciado';

  /**
   * TODO
   */
  @Prop() keyImagem = 'Imagem';

  /**
   * TODO
   */
  @Prop() keyPorcentagem = 'Porcentagem';

  /**
   * TODO
   */
  @Prop() keyRiscada = 'Riscada';

  /**
   * TODO
   */
  @Prop({ mutable: true, reflect: true }) respostaCorreta!: string;

  /**
   * TODO
   */
  @Prop({ mutable: true, reflect: true }) mostraResposta!: boolean;

  /**
   * TODO
   */
  @Prop({ mutable: true, reflect: true }) alternativaSelecionada!: string;

  /**
   * TODO
   */
  @Prop({ mutable: true }) permiteRiscar = true;

  /**
   * TODO
   */
  @Event() medChange!: EventEmitter<MedAlternativaInterface>;

  /**
   * TODO
   */
  @Event() medRiscada!: EventEmitter<MedAlternativaInterface>;

  /**
   * TODO
   */
  @Event() medGalleryRequest!: EventEmitter<MedAlternativaInterface>;

  @State() permiteAlterar = true;
  @State() riscarAtivoIndice = -1;
  baseClass = new MedAlternativasBase(this);

  @Listen('click', { target: 'window' })
  handleClick(event: any) {
    this.baseClass.handleClick(event);
  }

  @Watch('alternativas')
  onAlternativasChanged(newValue: MedAlternativaInterface | any, oldValue: MedAlternativaInterface | any) {
    this.baseClass.onAlternativasChanged(newValue, oldValue)
  }

  render() {
    const {dsColor, permiteRiscar, mostraResposta, alternativaSelecionada} = this;
    const exibeAcerto = this.alternativaSelecionada && mostraResposta;

    return (
      <Host
        from-stencil
        class={generateMedColor(dsColor, {
          'med-alternativas': true,
        })}>
         <div class="med-alternativas__list" role="list">

          {this.alternativas.map((alternativa: any, indice: number) => (
            <div role="listitem"
              onTouchStart={(event) => this.baseClass.onTouchStart(event, indice)}
              onTouchEnd={(event) => this.baseClass.onTouchEnd(event, alternativa)}
              onMouseDown={(event) => this.baseClass.onTouchStart(event, indice)}
              onMouseUp={(event) => this.baseClass.onTouchEnd(event, alternativa)}
              class={`
                med-alternativas__item med-alternativas__item--${alternativa[this.keyAlternativa]}
                ${permiteRiscar ? 'med-alternativas__item--permite-riscar' : ''}
                ${alternativa[this.keyRiscada] && permiteRiscar ? 'med-alternativas__item--riscado' : ''}
                ${exibeAcerto && alternativa[this.keyAlternativa] === this.respostaCorreta && this.respostaCorreta === this.alternativaSelecionada ? 'med-alternativas__item--correta' : ''}
                ${exibeAcerto && alternativa[this.keyAlternativa] === this.respostaCorreta && this.respostaCorreta !== this.alternativaSelecionada ? 'med-alternativas__item--certa' : ''}
                ${exibeAcerto && alternativa[this.keyAlternativa] !== this.respostaCorreta && alternativa[this.keyAlternativa] === this.alternativaSelecionada ? 'med-alternativas__item--incorreta' : ''}
                ${!exibeAcerto && alternativa[this.keyAlternativa] === this.alternativaSelecionada ? 'med-alternativas__item--selecionada' : ''}
              `}
            >
              <div class="med-alternativas__wrapper">
                <div class="med-alternativas__container">
                  <div class="med-alternativas__left">{alternativa[this.keyAlternativa]}</div>
                  <div class="med-alternativas__right" innerHTML={alternativa[this.keyEnunciado]}>

                    {alternativa[this.keyImagem] &&
                      <div class={`image-container ${alternativa[this.keyEnunciado] ? 'image-container--margin' : ''}`} onClick={(event) => this.baseClass.imageRequest(event, alternativa)}>
                        <div class='image-container__wrapper'>
                          <img class='image-container__image' src={alternativa[this.keyImagem]} />

                          <div class='image-container__button'>
                            <ion-icon name="med-expand image-container__icon"></ion-icon>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <div class={`med-alternativas__riscar ${indice === this.riscarAtivoIndice && permiteRiscar ? 'med-alternativas__riscar--show' : ''}`}
                    onClick={(event) => this.baseClass.riscar(event, alternativa)}>{(alternativa[this.keyRiscada] ? 'Retomar' : 'Riscar') + ' alternativa'}</div>
                </div>
              </div>

              <ion-progress-bar ds-name="skin" percentage class={`
                med-alternativas__progress-bar
                ${mostraResposta && alternativaSelecionada ? 'med-alternativas__progress-bar--toggle' : '' }
              `}
                value={alternativa[this.keyPorcentagem]}>
              </ion-progress-bar>
            </div>
          ))}

        </div>
      </Host>
    );
  }

}

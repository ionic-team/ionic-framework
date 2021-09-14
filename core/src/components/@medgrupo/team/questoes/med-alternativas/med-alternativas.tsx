import { Component, Host, h, Prop, Event, EventEmitter, State, Element, Listen } from '@stencil/core';
import { Color, Neutral } from '../../../../../interface';
import { Coordenada, distanciaEuclidiana, getPositionFromEvent } from '../../../../../utils/medgrupo';
import { createColorClasses } from '../../../../../utils/theme';
import { MedAlternativaInterface, MedAlternativasInterface } from '../med-alternativas/med-alternativas-interface';
@Component({
  tag: 'med-alternativas',
  styleUrl: 'med-alternativas.scss',
  shadow: true,
})
export class MedAlternativas implements MedAlternativasInterface {
  @Element() hostElement!: HTMLElement;

  @Prop() color?: Color;
  @Prop() neutral?: Neutral;

  @Prop({ mutable: true }) alternativas: MedAlternativaInterface | any = [];

  @Prop() keyAlternativa = 'Alternativa';
  @Prop() keyEnunciado = 'Enunciado';
  @Prop() keyImagem = 'Imagem';
  @Prop() keyPorcentagem = 'Porcentagem';
  @Prop() keyRiscada = 'Riscada';

  @Prop({ mutable: true, reflect: true }) respostaCorreta!: string;
  @Prop({ mutable: true, reflect: true }) mostraResposta!: boolean;
  @Prop({ mutable: true, reflect: true }) alternativaSelecionada!: string;

  @Prop({ mutable: true }) permiteRiscar = true;

  @Event() medChange!: EventEmitter<MedAlternativaInterface>;
  @Event() medRiscada!: EventEmitter<MedAlternativaInterface>;
  @Event() medGalleryRequest!: EventEmitter<MedAlternativaInterface>;

  @State() permiteAlterar = true;
  @State() riscarAtivoIndice = -1;

  dataStart!: Date;
  dataEnd!: Date;
  positionStart: Coordenada | undefined;
  distanciaMinimaClick = 50;
  tempoLongPress = 1000;
  timer!: any;

  @Listen('click', { target: 'window' })
  handleClick(event: any) {
    if(!event.target.classList.contains('med-alternativas')) {
      this.riscarAtivoIndice = -1;
      this.permiteAlterar = true;
    }
  }

  private onTouchStart(event: any, indice: number) {
    if(event.target.closest('.med-alternativas__riscar')?.classList.contains('med-alternativas__riscar')) {
      return;
    }

    this.dataStart = new Date();
    this.positionStart = getPositionFromEvent(event);
    
    this.timer = setTimeout(() => {
      this.dataEnd = new Date();

      const tempoTotal = this.dataEnd.getTime() - this.dataStart.getTime();

      if (tempoTotal >= this.tempoLongPress) {
        this.riscarAtivoIndice = indice;
        this.permiteAlterar = false;
      }

    }, this.tempoLongPress);
  }

  private onTouchEnd(event: any, alternativa: MedAlternativaInterface) {
    if(event.target.closest('.med-alternativas__riscar')?.classList.contains('med-alternativas__riscar')) {
      return;
    }

    const positionEnd = getPositionFromEvent(event);
    
    clearTimeout(this.timer);

    if(this.permiteAlterar &&
      distanciaEuclidiana(this.positionStart, positionEnd) <
        this.distanciaMinimaClick) {
      this.riscarAtivoIndice = -1;
      this.alterarAlternativa(alternativa);
    }

    this.permiteAlterar = true;
  }

  private alterarAlternativa(item: any) {
    const alternativa: MedAlternativaInterface = item;

    if(alternativa.Riscada && this.permiteRiscar) {
      return;
    }

    this.alternativaSelecionada = alternativa.Alternativa;

    this.medChange.emit(alternativa);
  }

  private riscar(event: any, alternativa: any) {
    event.stopPropagation();

    alternativa[this.keyRiscada] = !alternativa[this.keyRiscada];

    this.riscarAtivoIndice = -1;

    this.medRiscada.emit(alternativa);

    this.permiteAlterar = true;

    this.alternativas = [...this.alternativas];
  }

  private imageRequest(event: any, alternativa: any) {
    event.stopPropagation();

    this.medGalleryRequest.emit(alternativa);
  }

  render() {
    const {color, neutral, permiteRiscar, mostraResposta, alternativaSelecionada} = this;
    const exibeAcerto = this.alternativaSelecionada && mostraResposta;
    let hasImage = false;

    if(this.alternativas) {
      this.alternativas.forEach((element:any) => {
        if(element.Imagem) hasImage = true;
      });
    }

    return (
      <Host
        from-stencil
        class={createColorClasses(color, {
          'med-alternativas': true,
        }, neutral)}>
         <div class={`
           med-alternativas__list
           ${hasImage ? 'med-alternativas__list--has-image' : ''}
           `} role="list">

          {this.alternativas.map((alternativa: any, indice: number) => (
            <div role="listitem"
              onTouchStart={(event) => this.onTouchStart(event, indice)}
              onTouchEnd={(event) => this.onTouchEnd(event, alternativa)}
              onMouseDown={(event) => this.onTouchStart(event, indice)}
              onMouseUp={(event) => this.onTouchEnd(event, alternativa)}
              class={`
                med-alternativas__item med-alternativas__item--${alternativa[this.keyAlternativa]}
                ${permiteRiscar ? 'med-alternativas__item--permite-riscar' : ''}
                ${indice === this.riscarAtivoIndice && permiteRiscar ? 'med-alternativas__item--show' : ''}
                ${alternativa[this.keyRiscada] && permiteRiscar ? 'med-alternativas__item--riscado' : ''}
                ${exibeAcerto && alternativa[this.keyAlternativa] === this.respostaCorreta && this.respostaCorreta === this.alternativaSelecionada ? 'med-alternativas__item--correta' : ''}
                ${exibeAcerto && alternativa[this.keyAlternativa] === this.respostaCorreta && this.respostaCorreta !== this.alternativaSelecionada ? 'med-alternativas__item--certa' : ''}
                ${exibeAcerto && alternativa[this.keyAlternativa] !== this.respostaCorreta && alternativa[this.keyAlternativa] === this.alternativaSelecionada ? 'med-alternativas__item--incorreta' : ''}
                ${!exibeAcerto && alternativa[this.keyAlternativa] === this.alternativaSelecionada ? 'med-alternativas__item--selecionada' : ''}
              `}
            >
              <div class="med-alternativas__wrapper">
                <div class="med-alternativas__container">
                  <div class="med-alternativas__left">

                    <div class="option">
                      <span class="option__fake"></span>
                      <span class="option__letter">{alternativa[this.keyAlternativa]}</span>
                    </div>

                  </div>
                  <div class="med-alternativas__right">
                    <div class="med-alternativas__text" innerHTML={alternativa[this.keyEnunciado]}></div>

                  {alternativa[this.keyImagem] &&
                    <div class={`image-container ${alternativa[this.keyEnunciado] ? 'image-container--margin' : ''}`} onClick={(event) => this.imageRequest(event, alternativa)}>
                      <div class='image-container__wrapper'>
                        <img class='image-container__image' src={alternativa[this.keyImagem]} />

                        <div class='image-container__button'>
                          <ion-icon name="med-expand image-container__icon"></ion-icon>
                        </div>
                      </div>
                    </div>}

                    <ion-progress-bar percentage class={`
                      med-alternativas__progress-bar
                      ${mostraResposta && alternativaSelecionada ? 'med-alternativas__progress-bar--toggle' : '' }
                    `}
                      value={alternativa[this.keyPorcentagem]}>
                    </ion-progress-bar>
                  </div>
                  <div class={`med-alternativas__riscar ${indice === this.riscarAtivoIndice && permiteRiscar ? 'med-alternativas__riscar--show' : ''}`}
                    onClick={(event) => this.riscar(event, alternativa)}>
                    <ion-icon class="med-alternativas__riscar-icon med-icon" name="med-riscar"></ion-icon>
                    <div class="med-alternativas__riscar-span">
                      {(alternativa[this.keyRiscada] ? 'Restaurar ' : 'Riscar ')}
                      <span class="med-alternativas__riscar-desktop"> alternativa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </Host>
    );
  }

}

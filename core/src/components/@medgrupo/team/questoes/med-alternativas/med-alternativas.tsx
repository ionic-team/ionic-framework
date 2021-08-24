import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { Color } from '../../../../../interface';
import { createColorClasses } from '../../../../../utils/theme';
import { MedAlternativaInterface, MedAlternativasInterface } from './med-alternativas-interface';

@Component({
  tag: 'med-alternativas',
  styleUrl: 'med-alternativas.scss',
  shadow: true,
})
export class MedAlternativas implements MedAlternativasInterface {
  @Prop() podeRiscar!: boolean;
  @Prop() isDesktop!: boolean;

  @Prop() alternativas: MedAlternativaInterface | any = [];

  @Prop() keyAlternativa = 'Alternativa';
  @Prop() keyEnunciado = 'Enunciado';
  @Prop() keyImagem = 'Imagem';
  @Prop() keyPorcentagem = 'Porcentagem';

  @Prop({ mutable: true, reflect: true }) respostaCorreta!: string;
  @Prop({ mutable: true, reflect: true }) mostraResposta!: boolean;
  @Prop({ mutable: true, reflect: true }) alternativaSelecionada!: string;

  @Event() medChange!: EventEmitter<MedAlternativaInterface>;
  @Event() medGalleryRequest!: EventEmitter<MedAlternativaInterface>;

  @State() alternativaRiscada: any;

  @State() alternativaPressionada: any;

  /**
   * Define a cor neutra do componente.
   */
  @Prop() color?: Color;

  dataStart!: Date;
  dataEnd!: Date;
  tempoLongPress = 1000;
  timer!: any;

  private onTouchStart(alternativaPressionada: any) {
    if (!this.isDesktop) {
      this.dataStart = new Date();
      this.timer = setTimeout(() => {
        this.dataEnd = new Date();
        const tempoTotal = this.dataEnd.getTime() - this.dataStart.getTime();
        if (tempoTotal >= this.tempoLongPress) {
          if (this.permiteRiscar(alternativaPressionada)) {
            for (const alternativa of this.alternativas) {
              if (alternativa.Alternativa != alternativaPressionada.Alternativa) {
                alternativa.Pressionada = false;
              }
            }
            alternativaPressionada.Pressionada = !alternativaPressionada.Pressionada;
            this.alternativaPressionada = { alternativaPressionada };
          }
        }
      }, this.tempoLongPress);
    }
  }

  private onTouchEnd() {
    clearTimeout(this.timer);
  }

  private cssClassAlternativa(alternativa: string) {
    this.podeRiscar = true;
    let objAlternativa = this.getAlternativa(alternativa);
    let classe = 'alternativa';

    if (!objAlternativa.Riscada) {
      if (this.mostraResposta && this.alternativaSelecionada) {
        if (alternativa === this.respostaCorreta) {
          classe += ' alternativa--correta';
        } else if (alternativa === this.alternativaSelecionada) {
          classe += ' alternativa--incorreto';
        }
      }
    }

    classe += this.getCssClassAlternativaRiscada(objAlternativa);

    return classe;
  }

  private cssClassOption(alternativa: any) {
    let classe = 'alternativa__option';
    if (alternativa.Riscada) {
      classe += ' alternativa__option--riscada';
    }
    return classe;
  }

  private getCssClassAlternativaRiscada(objAlternativa: any) {
    let classe = '';
    if (this.podeRiscar && objAlternativa) {
      if (!this.isDesktop && objAlternativa.Pressionada) {
        classe += ' alternativa--pode-riscar-mobile';
      } else if (this.isDesktop) {
        classe += ' alternativa--pode-riscar';
      }

      if(objAlternativa && objAlternativa.Riscada) {
        classe += ' alternativa--riscada';
      }
    }
    return classe;
  }

  private respostaAlterada(alternativa: string) {
    this.alternativaSelecionada = alternativa;
    let objAlternativa = this.getAlternativa(alternativa);
    if (objAlternativa && !objAlternativa.Riscada) {
      this.medChange.emit(objAlternativa);
    }
  }

  private imageRequest(alternativa: any) {
    this.medGalleryRequest.emit(alternativa);
  }

  private riscar(alternativa: any) {
    if (this.permiteRiscar(alternativa)) {
      alternativa.Riscada = !alternativa.Riscada;
      if (alternativa.Alternativa === this.alternativaSelecionada) {
        this.respostaAlterada('');
      }
      this.alternativaRiscada = { alternativa };
      if (!this.isDesktop) {
        alternativa.Pressionada = !alternativa.Pressionada;
      }
    }
  }

  permiteRiscar(alternativa: any) {
    let countNaoRiscadas = 0;
    for (const alternativa of this.alternativas) {
      countNaoRiscadas += !alternativa.Riscada ? 1 : 0;
    }
    return alternativa.Riscada || (!alternativa.Riscada && countNaoRiscadas > 1);
  }

  private getAlternativa(key: string) {
    let objAlternativa;
    for (const item of this.alternativas) {
      if(item[this.keyAlternativa] === key) {
        objAlternativa = item;
        break;
      }
    }
    return objAlternativa;
  }

  render() {
    let hasImage = false;
    for(const alternativa of this.alternativas) {
      if(alternativa[this.keyImagem]) {
        hasImage = true
        break;
      }
    }

    const { color } = this;

    return (
      <Host from-stencil
      class={createColorClasses(color, {
        'med-alternativas': true,
      }, null)}
      >
        <ion-radio-group onIonChange={ev => this.respostaAlterada(ev.detail.value)} value={this.alternativaSelecionada}>
          <ul class={`alternativas ${hasImage ? 'alternativas--imagem' : ''}`}>

            {this.alternativas.map((alternativa: any) => (
              <div class="alternativa-wrapper" onPointerDown={() => this.onTouchStart(alternativa)} onPointerUp={() => this.onTouchEnd()}>
                <li class={this.cssClassAlternativa(alternativa[this.keyAlternativa]) + (alternativa.Pressionada ? ' alternativa--pode-riscar-mobile' : '')}>
                  <med-option class={this.cssClassOption(alternativa)}>
                    <ion-radio
                      value={alternativa[this.keyAlternativa]}
                    ></ion-radio>
                    <label slot="label">{alternativa[this.keyAlternativa]}</label>
                  </med-option>

                  <div class='alternativa__right'>
                    {alternativa[this.keyEnunciado] && <div class='alternativa__text' innerHTML={alternativa[this.keyEnunciado]}></div>}

                    <div class='image-container' onClick={() => this.imageRequest(alternativa)}>
                      {alternativa[this.keyImagem] && <img class='alternativa__image' src={alternativa[this.keyImagem]} />}
                      <div class='overlay'>
                        <div class="overlay__content">
                          <p class="overlay__label">clique para ampliar</p>
                          <ion-icon name="med-expand"></ion-icon>
                        </div>
                      </div>
                    </div>

                    {!alternativa.Riscada &&
                      <ion-progress-bar percentage class={`
                        ion-progress-bar
                        ${this.mostraResposta && this.alternativaSelecionada ? 'ion-progress-bar--toggle' : '' }
                        ${alternativa[this.keyPorcentagem] === 1 ? 'ion-progress-bar--100' : '' }`}
                        value={alternativa[this.keyPorcentagem]}>
                      </ion-progress-bar>
                    }
                  </div>

                  {this.podeRiscar && (alternativa.Pressionada || this.isDesktop) &&
                    <div class="riscar" onClick={() => this.riscar(alternativa)}>
                      <ion-icon name="med-riscar"></ion-icon>
                      <span class="riscar__label">{(alternativa.Riscada ? 'Retomar' : 'Riscar') + (this.isDesktop ? ' alternativa' : '')}</span>
                    </div>
                  }
                </li>
              </div>
            ))}

          </ul>
        </ion-radio-group>
      </Host>
    );
  }
}

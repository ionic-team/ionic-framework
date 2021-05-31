import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { MedAlternativaInterface, MedAlternativasInterface } from './med-alternativas-interface';

@Component({
  tag: 'med-alternativas',
  styleUrl: 'med-alternativas.scss',
  shadow: true,
})
export class MedAlternativas implements MedAlternativasInterface {
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

  private cssClassAlternativa(alternativa: string) {
    let classe = 'alternativa';

    if (this.mostraResposta && this.alternativaSelecionada) {
      if (alternativa === this.respostaCorreta) {
        classe += ' alternativa--correta';
      } else if (alternativa === this.alternativaSelecionada) {
         classe += ' alternativa--incorreto';
      }
    }

    return classe;
  }

  private respostaAlterada(alternativa: string) {
    this.alternativaSelecionada = alternativa;

    let objAlternativa;
    for (const item of this.alternativas) {
      if(item[this.keyAlternativa] === alternativa) {
        objAlternativa = item;
        break;
      }
    }

    this.medChange.emit(objAlternativa);
  }

  private imageRequest(alternativa: any) {
    this.medGalleryRequest.emit(alternativa);
  }

  render() {
    let hasImage = false;
    for(const alternativa of this.alternativas) {
      if(alternativa[this.keyImagem]) {
        hasImage = true
        break;
      }
    }

    return (
      <Host from-stencil>
        <ion-radio-group onIonChange={ev => this.respostaAlterada(ev.detail.value)}  value={this.alternativaSelecionada}>
          <ul class={`alternativas ${hasImage ? 'alternativas--imagem' : ''}`}>

            {this.alternativas.map((alternativa: any) => (
              <li class={this.cssClassAlternativa(alternativa[this.keyAlternativa])}>
                <med-option class='alternativa__option'>
                  <ion-radio
                    value={alternativa[this.keyAlternativa]}
                  ></ion-radio>
                  <label slot="label">{alternativa[this.keyAlternativa]}</label>
                </med-option>

                <div class='alternativa__right'>
                  {alternativa[this.keyEnunciado] && <div class='alternativa__text' innerHTML={alternativa[this.keyEnunciado]} ></div>}

                  <div class='image-container' onClick={() => this.imageRequest(alternativa)}>
                    {alternativa[this.keyImagem] && <img class='alternativa__image' src={alternativa[this.keyImagem]} />}
                    <div class='overlay'>
                      <div class="overlay__content">
                        <p class="overlay__label">clique para ampliar</p>
                        <ion-icon name="med-expand"></ion-icon>
                      </div>
                    </div>
                  </div>

                  <ion-progress-bar percentage class={`
                    ion-progress-bar
                    ${this.mostraResposta && this.alternativaSelecionada ? 'ion-progress-bar--toggle' : '' }
                    ${alternativa[this.keyPorcentagem] === 1 ? 'ion-progress-bar--100' : '' }`}
                    value={alternativa[this.keyPorcentagem]}>
                  </ion-progress-bar>
                </div>
              </li>
            ))}

          </ul>
        </ion-radio-group>
      </Host>
    );
  }
}

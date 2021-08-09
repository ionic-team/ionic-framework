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
  @Event() medClick!: EventEmitter<MedAlternativaInterface>
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


  private onMedChange(alternativa: string){
    let objAlternativa = this.respostaAlterada(alternativa)
    this.medChange.emit(objAlternativa);
  }

  private onMedClick(alternativa: string){
    let objAlternativa = this.respostaAlterada(alternativa)
    this.medClick.emit(objAlternativa);
  }

  private respostaAlterada(alternativa: string) {
    this.alternativaSelecionada = alternativa;
    let objAlternativa = this.alternativas.find((item:any)=>item[this.keyAlternativa]===alternativa);
    return objAlternativa
  }

  private imageRequest(alternativa: any,ev:Event) {
    this.medGalleryRequest.emit(alternativa);
    ev.stopPropagation()
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
        <ion-radio-group onIonChange={ev => this.onMedChange(ev.detail.value)}  value={this.alternativaSelecionada}>
          <ul class={`alternativas ${hasImage ? 'alternativas--imagem' : ''}`}>
            {this.alternativas.map((alternativa: any) => (
              <li onClick={() => this.onMedClick(alternativa[this.keyAlternativa])} class={this.cssClassAlternativa(alternativa[this.keyAlternativa])}>
                <med-option class='alternativa__option'>
                  <ion-radio
                    value={alternativa[this.keyAlternativa]}
                  ></ion-radio>
                  <label slot="label">{alternativa[this.keyAlternativa]}</label>
                </med-option>

                <div class='alternativa__right'>
                  {alternativa[this.keyEnunciado] && <div class='alternativa__text' innerHTML={alternativa[this.keyEnunciado]}></div>}

                  <div class='image-container' onClick={(ev) => this.imageRequest(alternativa,ev)}>
                    {alternativa[this.keyImagem] && <img class='alternativa__image' src={alternativa[this.keyImagem]} />}
                    <div class='overlay'>
                      <div class="overlay__content">
                        <p class="overlay__label">clique para ampliar</p>
                        <ion-icon class="med-icon" name="med-expand"></ion-icon>
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

                {/* <div class="riscar">
                  <ion-icon name="med-riscar"></ion-icon>
                  <span class="riscar__label">Riscar</span>
                </div> */}
              </li>
            ))}

          </ul>
        </ion-radio-group>
      </Host>
    );
  }
}

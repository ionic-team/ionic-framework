import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { MedSkin } from '../../../../../global/templarios/skin.enum';
import { Color } from '../../../../../interface';
import { MedAlternativaInterface, MedAlternativasInterface } from './med-alternativas-interface';

@Component({
  tag: 'med-alternativas',
  styleUrl: 'med-alternativas.scss',
  shadow: true,
})
export class MedAlternativas implements MedAlternativasInterface {

  /**
   * TODO
   */
  @Prop() dsColor?: Color;

  /**
   * TODO
   */
  @Prop({ mutable: true }) alternativas: MedAlternativaInterface | any = [];

  /**
   * TODO
   */
  @Prop() dsSkinConfig!: any;

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

  render() {
    const {
      dsSkinConfig,
      dsColor,
      alternativas,
      keyAlternativa,
      keyEnunciado,
      keyImagem,
      keyPorcentagem,
      keyRiscada,
      respostaCorreta,
      mostraResposta,
      alternativaSelecionada,
      permiteRiscar
    } = this;

    return (
      <Host from-stencil>
        {dsSkinConfig.alternativas === MedSkin.A  && <med-alternativas-a
          dsSkinConfig={dsSkinConfig}
          dsColor={dsColor}
          alternativas={alternativas}
          keyAlternativa={keyAlternativa}
          keyEnunciado={keyEnunciado}
          keyImagem={keyImagem}
          keyPorcentagem={keyPorcentagem}
          keyRiscada={keyRiscada}
          respostaCorreta={respostaCorreta}
          mostraResposta={mostraResposta}
          alternativaSelecionada={alternativaSelecionada}
          permiteRiscar={permiteRiscar}
          onMedChange={ev => this.medChange.emit(ev.detail)}
          onMedRiscada={ev => this.medRiscada.emit(ev.detail)}
          onMedGalleryRequest={ev => this.medGalleryRequest.emit(ev.detail)}
        ></med-alternativas-a>}

        {dsSkinConfig.alternativas === MedSkin.B  && <med-alternativas-b
          dsSkinConfig={dsSkinConfig}
          dsColor={dsColor}
          alternativas={alternativas}
          keyAlternativa={keyAlternativa}
          keyEnunciado={keyEnunciado}
          keyImagem={keyImagem}
          keyPorcentagem={keyPorcentagem}
          keyRiscada={keyRiscada}
          respostaCorreta={respostaCorreta}
          mostraResposta={mostraResposta}
          alternativaSelecionada={alternativaSelecionada}
          permiteRiscar={permiteRiscar}
          onMedChange={ev => this.medChange.emit(ev.detail)}
          onMedRiscada={ev => this.medRiscada.emit(ev.detail)}
          onMedGalleryRequest={ev => this.medGalleryRequest.emit(ev.detail)}
        ></med-alternativas-b>}
      </Host>
    );
  }

}

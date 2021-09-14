import { Component, Host, h, Prop } from '@stencil/core';
import { MedColor } from '../../../../interface';
import { generateMedColor } from '../../../../utils/med-theme';

/**
 * @slot avatar - Slot destinado ao avatar.
 * @slot rate - Slot destinado ao componete de rate.
 */
@Component({
  tag: 'med-item-aulas',
  styleUrl: 'med-item-aulas.scss',
  shadow: true,
})
export class MedItemAulas {
  /**
    * Define a cor do componente.
    */
  @Prop({ reflect: true }) dsColor?: MedColor;

  /**
    * Define o nome do professor.
    */
  @Prop() professor!: string;

  /**
    * Define a porcentagem de visualização de vídeos.
    */
  @Prop() porcentagem!: number;

  /**
    * Define a quantidade de vídeos.
    */
  @Prop() videos!: string;

  render() {
    const { dsColor, professor, porcentagem, videos } = this;

    return (
      <Host from-stencil
        class={generateMedColor(dsColor, {
          'med-item-aulas': true,
        })}>
        <div class="med-item-aulas__top">
          <slot name="avatar"></slot>
          <div class="med-item-aulas__info">
            <p class="med-item-aulas__professor">Professor</p>
            <p class="med-item-aulas__nome">{professor}</p>
            <p class="med-item-aulas__total">{Math.round(porcentagem)}% concluido - {videos} vídeos</p>
            <slot name="rate"></slot>
          </div>
          <ion-icon class="med-icon" name="med-direita"></ion-icon>
        </div>
        <div class="med-item-aulas__bottom">
          <ion-progress-bar ds-color={dsColor} ds-name="minimalist" value={porcentagem / 100}></ion-progress-bar>
        </div>
      </Host>
    );
  }

}

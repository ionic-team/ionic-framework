import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { generateMedColor } from '../../../../../utils/med-theme';

@Component({
  tag: 'med-enunciado',
  styleUrl: 'med-enunciado.scss',
  shadow: true,
})

export class MedEnunciado {
  /**
   * TODO
   */
  @Prop({ mutable: true, reflect: true }) imagens!: string[] | string;

  /**
   * TODO
   */
  @Event() medGalleryRequest!: EventEmitter<string>;

  /**
   * Define a variação do componente.
   */
  @Prop({ reflect: true }) dsName?: 'skin';

  private imageRequest(imagem: string) {
    this.medGalleryRequest.emit(imagem);
  }

  render() {
    let imagens;
    const { dsName } = this;

    if (this.imagens) {
      this.imagens = typeof this.imagens === 'string' ? JSON.parse(this.imagens) : this.imagens;

      imagens = (
        <ul class='list'>
          {(this.imagens as string[]).map((imagem: any) => (
            <li class="list__item" onClick={() => this.imageRequest(imagem)}>
              <img class="list__image" src={imagem} alt=""/>
              <div class="image__zoom">
                <ion-icon class="med-icon" name="med-busca"></ion-icon>
              </div>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <Host
        from-stencil
        class={generateMedColor(null, {
          'med-enunciado': true,
          [`med-enunciado--${dsName}`]: dsName !== undefined,
        })}>
        <slot></slot>
        { imagens }
      </Host>
    );
  }

}

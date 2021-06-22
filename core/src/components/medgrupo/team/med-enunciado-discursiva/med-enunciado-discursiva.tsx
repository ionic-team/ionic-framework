import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'med-enunciado-discursiva',
  styleUrl: 'med-enunciado-discursiva.scss',
  shadow: true,
})
export class MedEnunciadoDiscursiva {
  @Prop({ mutable: true, reflect: true }) imagens!: string[] | string;

  @Event() medGalleryRequest!: EventEmitter<string>;

  private imageRequest(imagem: string) {
    this.medGalleryRequest.emit(imagem);
  }

  render() {
    let imagens;

    if (this.imagens) {
      this.imagens = typeof this.imagens === 'string' ? JSON.parse(this.imagens) : this.imagens;

      imagens = (
        <ul class='list'>
          {(this.imagens as string[]).map((imagem: any) => (
            <li class="list__item" onClick={() => this.imageRequest(imagem)}>
              <img class="list__image" src={imagem} alt=""/>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <Host from-stencil>
        <span class="number">01 -</span>
        <slot></slot>
        { imagens }
      </Host>
    );
  }

}

import { Component, Host, h, Prop, State } from '@stencil/core';
import { MedImageZoomItemInterface } from './med-image-zoom-interface';
import { modalController } from '../../../../utils/overlays';

@Component({
  tag: 'med-image-zoom',
  styleUrl: 'med-image-zoom.scss',
  scoped: true
})
export class MedImageZoom {
  @Prop({ mutable: true, reflect: true }) imagens: MedImageZoomItemInterface[] | any = []
  @Prop({ mutable: true, reflect: true }) marcaAguaSuperior?: string
  @Prop({ mutable: true, reflect: true }) marcaAguaInferior?: string
  @Prop({ mutable: true, reflect: true }) titulo?: string

  @State() slider!: any

  private sliderOpts = {
    zoom: {
      maxRation: 5
    },
    intialSlide: 1,
  }
  zoom(zoomIn: boolean) {
    const zoom = this.slider.swiper.zoom
    if (zoomIn) {
      zoom.in();
    } else {
      zoom.out();
    }
  }

  dismiss() {
    modalController.dismiss();
  }

  render() {
    return (
      <Host from-stencil>
        <med-header class="header">
          <med-navbar slot="navbar" ds-name="transparent" ds-theme="light">
            <span slot="title" innerHTML={this.titulo}></span>

            <ion-button ds-name="icon-only" slot="right" onClick={() => this.dismiss()}>
              <ion-icon slot="icon-only" name="med-close"></ion-icon>
            </ion-button>
          </med-navbar>
        </med-header>

        <ion-content class="content">
          <ion-slides
            ref={(el) => { this.slider = el as any; (el as any).options = this.sliderOpts; }}
            pager={this.imagens && this.imagens.length > 1}>
            {this.imagens.map((img: any) =>
              <ion-slide>
                <span class="marca-agua-superior">{this.marcaAguaSuperior}</span>
                <div class="swiper-zoom-container">
                  <img class="zoom-imagem" src={img?.src} />
                  <div class="zoom-legenda-container">
                    <div class="zoom-legenda" innerHTML={img?.legenda}></div>
                  </div>
                </div>
              </ion-slide>
            )}
          </ion-slides>
          <span class="marca-agua-inferior">{this.marcaAguaInferior}</span>
        </ion-content>
        <div class="button-container">
          <button class="button button--in" onClick={() => this.zoom(true)}>
            <ion-icon name="med-plus"></ion-icon>
          </button>
          <button class="button button--out" onClick={() => this.zoom(false)}>
            <ion-icon name="med-minus"></ion-icon>
          </button>
          <button class="button button--close" onClick={() => this.dismiss()}>
            <ion-icon name="med-close"></ion-icon>
          </button>
        </div>
      </Host>
    );
  }

}

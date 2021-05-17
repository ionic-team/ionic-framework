import { Component, Host, h, Prop, State, } from '@stencil/core';
import { MedImagensZoomInterface } from './med-image-zoom-interface';
import { modalController } from '../../../../utils/overlays';

@Component({
  tag: 'med-image-zoom',
  styleUrl: 'med-image-zoom.scss',
  shadow: true,
})
export class MedImageZoom {
  @Prop({ mutable: true, reflect: true }) imagens: MedImagensZoomInterface[] | any = []
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
      <Host>
        <med-header>
          <med-toolbar slot="toolbar">
            <ion-buttons slot="start">
              <ion-button dsName="icon-only" dsSize="md" onClick={() => this.zoom(true)} >
                in
              <ion-icon slot="icon-only" name="md-add"></ion-icon>
              </ion-button>
              <ion-button dsName="icon-only" dsSize="md" onClick={() => this.zoom(false)}>
                out
              <ion-icon slot="icon-only" name="md-remove"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button dsName="icon-only" onClick={() => this.dismiss()}>
                X
                <ion-icon slot="icon-only" name="md-close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </med-toolbar>
        </med-header>
        <ion-content class="galeria rc-ion-content">
          <ion-grid>
            <ion-slides
              ref={(el) => { this.slider = el as any; (el as any).options = this.sliderOpts }}
              pager={this.imagens && this.imagens.length > 1}>
              {this.imagens.map((img: any) =>
                <ion-slide>
                  <h3>{img?.legenda}</h3>
                  <div class="swiper-zoom-container">
                    <img src={img?.link} />
                  </div>
                </ion-slide>
              )}
            </ion-slides>
          </ion-grid>
        </ion-content>
        <slot></slot>
      </Host>
    );
  }

}

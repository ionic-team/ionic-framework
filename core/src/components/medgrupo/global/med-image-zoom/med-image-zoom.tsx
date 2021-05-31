import { Component, Host, h, Prop, State, Listen} from '@stencil/core';
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
  @State() title!: any

  @Listen('ionSlideDidChange')
  ionSlideDidChangeHandler() {
   this.slider.getActiveIndex().then((idx: number)  => {
      this.title = this.imagens[idx].title;
   });;

  }

  @Listen('ionSlidesDidLoad')
  ionSlidesDidLoadHandler() {
   this.slider.getActiveIndex().then((idx: number)  => {
      this.title = this.imagens[idx].title;
   });;
  }

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
            <span slot="title">{this.title}</span>

            <ion-button ds-name="icon-only" slot="right"  onClick={() => this.dismiss()}>
              <ion-icon slot="icon-only" name="med-close"></ion-icon>
            </ion-button>
          </med-navbar>
        </med-header>

        <ion-content class="content">
          <ion-slides
            ref={(el) => { this.slider = el as any; (el as any).options = this.sliderOpts;}}
            pager={this.imagens && this.imagens.length > 1}>
            {this.imagens.map((img: any) =>
              <ion-slide>
                <div class="swiper-zoom-container">
                  <img src={img?.link} />
                  <p class="legenda">{img?.legenda}</p>
                </div>
              </ion-slide>
            )}
          </ion-slides>
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

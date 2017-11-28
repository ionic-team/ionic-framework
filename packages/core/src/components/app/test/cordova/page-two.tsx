import { Component, Element } from '@stencil/core';

@Component({
  tag: 'app-cordova-page-two'
})
export class AppCordovaPageTwo {

  @Element() element: HTMLElement;

  componentDidEnter() {
    console.log('page two did enter');
  }

  prevPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('app-cordova-page-one');
  }

  nextPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('app-cordova-page-three');
  }

  openModal() {

  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Page Two</ion-title>
          <ion-buttons slot='end'>
            <ion-button><ion-icon slot='icon-only' name='filter'></ion-icon></ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          Hello I am a sub header, with no border on top
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>

        <ion-button block onClick={() => this.prevPage()}>Go to Page One</ion-button>
        <ion-button block onClick={() => this.nextPage()} class='e2eCordovaPage3'>Go to Page Three</ion-button>
        <ion-button block color='secondary' onClick={() => this.openModal()} class='e2eCordovaOpenModal'>Open Modal</ion-button>

      </ion-content>
    ];
  }
}

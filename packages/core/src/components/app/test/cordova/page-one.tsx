import { Component, Element } from '@stencil/core';

@Component({
  tag: 'app-cordova-page-one'
})
export class AppCordovaPageOne {

  @Element() element: HTMLElement;

  componentDidEnter() {
    console.log('page one did enter');
  }

  nextPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('app-cordova-page-two');
  }

  goToTabs() {
    const nav = this.element.closest('ion-nav') as any;
    nav.setRoot('app-cordova-page-tabs');
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-buttons slot='start'>
            <ion-button><ion-icon slot='icon-only' name='menu'></ion-icon></ion-button>
          </ion-buttons>
          <ion-segment color='light'>
            <ion-segment-button checked>All</ion-segment-button>
            <ion-segment-button>Favorites</ion-segment-button>
          </ion-segment>
          <ion-buttons slot='end'>
            <ion-button><ion-icon slot='icon-only' name='search'></ion-icon></ion-button>
            <ion-button><ion-icon slot='icon-only' name='menu'></ion-icon></ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          <ion-title>I'm a toolbar</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>

        <ion-button onClick={() => this.nextPage()} block class='e2eCordovaPage2'>Go to Page Two</ion-button>
        <ion-button onClick={() => this.goToTabs()} color='secondary' block class='e2eCordovaPage2'>Go to Tabs</ion-button>

        <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>

        <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>

        <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>

      </ion-content>
    ];
  }
}

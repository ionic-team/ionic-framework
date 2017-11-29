import { Component, Element } from '@stencil/core';

@Component({
  tag: 'app-cordova-page-three'
})
export class AppCordovaPageThree {

  @Element() element: HTMLElement;

  componentDidEnter() {
    console.log('page one did enter');
  }

  nextPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('app-cordova-page-one');
  }

  prevPage() {
    const nav = this.element.closest('ion-nav') as any;
    nav.push('app-cordova-page-two');
  }

  render() {
    return [
      <ion-content>
        <h2>Page 3</h2>
        <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>
        <ion-button onClick={() => this.prevPage()} expand='block' class='e2eCordovaGoBack'>Go Back</ion-button>
      </ion-content>,

      <ion-footer>
        <ion-toolbar>
          <ion-title>I'm a bottom toolbar</ion-title>
        </ion-toolbar>
      </ion-footer>
    ];
  }
}

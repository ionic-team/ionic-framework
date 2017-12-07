
export class PageTwo {
  constructor(nav) {
    this.nav = nav;
  }

  getElement() {
    const element = document.createElement('div');
    element.innerHTML = `
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
</ion-header>
<ion-content>
  <div padding-bottom>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi scelerisque dolor lacus, ut vehicula arcu dapibus id. Morbi iaculis fermentum blandit. Curabitur tempus, ante et vehicula tempor, urna velit rutrum massa, quis suscipit purus lacus eget est. Sed nisi nulla, tempus id dictum a, cursus ut felis. Aliquam orci magna, rutrum nec tempor ac, fermentum quis eros. Sed ullamcorper felis sit amet tristique sagittis. Nullam sed tempus mi. Morbi sit amet lacinia leo. Nunc facilisis orci id consectetur dignissim. Integer dictum consectetur enim. Vivamus auctor, turpis ut eleifend pharetra, purus magna mattis arcu, vel pharetra tellus orci eget ex. Integer blandit posuere vehicula. Ut ipsum lorem, efficitur vitae eleifend tincidunt, fermentum nec lacus. Ut nec fermentum dui.</div>

  <ion-button expand='block' class="back">Go Back</ion-button>
  <ion-button expand='block' class='next e2eCordovaPage3'>Go to Page Three</ion-button>
  <ion-button expand='block' color='secondary' class='e2eCordovaOpenModal modal'>Open Modal</ion-button>

</ion-content>
`;

    this.element = element;
    return element;
  }

  initialize() {
    const backButton = this.element.querySelector('ion-button .back');
    backButton.addEventListener('click', async () => {
      await this.nav.pop();
    });

    const nextButton = this.element.querySelector('ion-button .next');
    nextButton.addEventListener('click', async () => {
      const pageThreeModule = await import('./page-three.js');
      const pageThree = new pageThreeModule.PageThree(this.nav);
      await this.nav.push(pageThree.getElement());
      // okay, the page is pushed, initialize it
      pageThree.initialize();
    });

    const modalButton = this.element.querySelector('ion-button .modal');
    modalButton.addEventListener('click', () => {
      alert('This is a problem for future Ionic team, let\'s let those comrades dal with it.');
    });
  }
}
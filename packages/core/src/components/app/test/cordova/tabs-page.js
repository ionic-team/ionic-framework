
export class TabsPage {
  constructor(nav) {
    this.nav = nav;
  }

  getElement() {
    const element = document.createElement('div');
    element.innerHTML = `
  <ion-tabs>
    <ion-tab title='Page 1' icon='chatboxes' class='tab-one'>
      <ion-nav class="tab-one-nav"></ion-nav>
    </ion-tab>

    <ion-tab title='Page 2' icon='map' class='tab-two'>
      <ion-nav class="tab-two-nav"></ion-nav>
    </ion-tab>

    <ion-tab title='Page 3' icon='person' class='tab-three'>
      <ion-nav class="tab-three-nav"></ion-nav>
    </ion-tab>
  </ion-tabs>
`;

    this.element = element;
    return element;
  }

  async initialize() {
    const navOne = this.element.querySelector('ion-tab.tab-one ion-nav');
    await navOne.componentOnReady();
    const pageOneModule = await import('./page-one.js');;
    const pageOne = new pageOneModule.PageOne(navOne);
    await navOne.setRoot(pageOne.getElement());

    const navTwo = this.element.querySelector('ion-tab.tab-two ion-nav');
    await navTwo.componentOnReady();
    const pageTwoModule = await import('./page-two.js');;
    const pageTwo = new pageTwoModule.PageTwo(navTwo);
    await navTwo.setRoot(pageTwo.getElement());

    const navThree = this.element.querySelector('ion-tab.tab-three ion-nav');
    await navThree.componentOnReady();
    const pageThreeModule = await import('./page-three.js');;
    const pageThree = new pageThreeModule.PageThree(navThree);
    await navThree.setRoot(pageThree.getElement());
  }
}
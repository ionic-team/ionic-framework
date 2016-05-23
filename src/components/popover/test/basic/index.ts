import {App, Page, Popover, NavController} from '../../../../../src';


@Page({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button ion-item>Learn Ionic</button>
      <button ion-item>Documentation</button>
      <button ion-item>Showcase</button>
      <button ion-item>GitHub Repo</button>

    </ion-list>
  `
})
class PopoverPage {

}


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private nav: NavController) {}

  presentPopover(ev) {
    let popover = Popover.create(PopoverPage, {}, {
      event: ev
    });

    this.nav.present(popover);

    this.nav.present(popover, {
      ev: ev
    });
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}

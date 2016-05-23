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
  popover: any;

  constructor(private nav: NavController) {}

  createPopover() {
    this.popover = Popover.create(PopoverPage);
  }

  presentPopover(ev) {
    this.createPopover();
    this.nav.present(this.popover, {
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

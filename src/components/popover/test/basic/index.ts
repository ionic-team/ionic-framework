import {App, Page, Popover, NavController} from '../../../../../src';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {
  constructor(private nav: NavController) {}

  presentPopover(ele, ev) {
    console.log(ev);

    let popover = Popover.create({
      template: `
        My Popover
      `,
      element: ele,
      event: ev
    });

    this.nav.present(popover);
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

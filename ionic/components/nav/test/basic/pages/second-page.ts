import {IonicView, NavController, NavParams} from 'ionic/ionic';
import {ThirdPage} from './third-page';
import {FirstPage} from './first-page';


@IonicView({
  template: `
    <ion-content class="padding">
      <h1>Second page</h1>
      <p>This page does not have a nav bar!</p>
      <p><button (click)="pop()">Pop (Go back to 1st)</button></p>
      <p><button id="from2To1" nav-pop>Pop with NavPop (Go back to 1st)</button></p>
      <p><button id="from2To3" (click)="push()">Push (Go to 3rd)</button></p>
      <p><button (click)="setItems()">setItems() (Go to 3rd, FirstPage 1st in history)</button></p>
      <div class="green"><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f></div>
    </ion-content>
  `
})
export class SecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.params = params;

    console.log('Second page params:', params);
  }

  setItems() {
    let items = [
      FirstPage,
      ThirdPage
    ];

    this.nav.setItems(items);
  }

  pop() {
    this.nav.pop();
  }

  push() {
    this.nav.push(ThirdPage);
  }

  // viewLoaded() {
  //   console.log('viewLoaded second page');
  // }

  // viewWillEnter() {
  //   console.log('viewWillEnter second page');
  // }

  // viewDidEnter() {
  //   console.log('viewDidEnter second page');
  // }

  // viewWillLeave() {
  //   console.log('viewWillLeave second page');
  // }

  // viewDidLeave() {
  //   console.log('viewDidLeave second page');
  // }

  // viewWillUnload() {
  //   console.log('viewWillUnload second page');
  // }

  // viewDidUnload() {
  //   console.log('viewDidUnload second page');
  // }

}

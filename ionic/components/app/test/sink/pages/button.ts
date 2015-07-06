import {Component, View, NgIf} from 'angular2/angular2';

import {Routable, NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';


@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Buttons</ion-title></ion-navbar>

  <ion-content class="padding">

    <h2>Buttons</h2>
    <p>
      The faithful button. Not only our favorite place to click, but a true friend.
    </p>
    <p>
      Buttons come in lots of different colors:
    </p>
    <p>
      <div (^click)="onButtonClick($event)">
        <button primary>Primary</button>
        <button secondary>Secondary</button>
        <button stable>Stable</button>
        <button light>Light</button>
        <button dark>Dark</button>
        <button danger>Danger</button>
      </div>
    </p>
    <p>
      various shapes:
    </p>
    <p>
      <div (^click)="onButtonClick($event)">
        <button primary small>small</button>
        <button dark>Medium</button>
        <button secondary large>LARGE</button>
      </div>
    </p>
    <p>
      and with different embellishments:
    </p>
    <p>
      <div (^click)="onButtonClick($event)">
        <button primary outline>Outline</button>
        <button dark clear>Clear</button>
        <button danger block>Block</button>
      </div>
    </p>
    </p>
      <div *ng-if="clicked">
      <b>CLICKED</b>
      </div>
    </p>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, NgIf]
})
export class ButtonPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }

  onButtonClick(event) {
    console.log('On button click', event);

    clearTimeout(this.clickTimeout);
    this.clicked = true;
    this.clickTimeout = setTimeout(() => {
      this.clicked = false;
    }, 500);
  }
}

new Routable(ButtonPage, {
  url: '/components/button',
  tag: 'button'
})

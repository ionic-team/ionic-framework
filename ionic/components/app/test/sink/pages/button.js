import {NgFor, NgIf} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

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
      Buttons come in lots of different colors, sizes (like those that take up the full width
      and those that flow inline), and shapes.
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
    window.nav = nav;
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

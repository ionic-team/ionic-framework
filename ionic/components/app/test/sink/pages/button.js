import {NgFor} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

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
      <div>
        <a class="button" href="#">a (default)</a>
        <button class="button">button (default)</button>
        <button class="button hover">hover</button>
        <button class="button activated">activated</button>
      </div>

      <div>
        <a class="button button-primary" href="#">a.primary</a>
        <button class="button button-primary">button.primary</button>
        <button class="button button-primary hover">hover</button>
        <button class="button button-primary activated">activated</button>
      </div>

      <div>
        <a class="button button-secondary" href="#">a.secondary</a>
        <button class="button button-secondary">button.secondary</button>
        <button class="button button-secondary hover">hover</button>
        <button class="button button-secondary activated">activated</button>
      </div>

      <div>
        <a class="button button-danger" href="#">a.danger</a>
        <button class="button button-danger">button.danger</button>
        <button class="button button-danger hover">hover</button>
        <button class="button button-danger activated">activated</button>
      </div>

      <div>
        <a class="button button-light" href="#">a.light</a>
        <button class="button button-light">button.light</button>
        <button class="button button-light hover">hover</button>
        <button class="button button-light activated">activated</button>
      </div>

      <div>
        <a class="button button-stable" href="#">a.stable</a>
        <button class="button button-stable">button.stable</button>
        <button class="button button-stable hover">hover</button>
        <button class="button button-stable activated">activated</button>
      </div>

      <div>
        <a class="button button-dark" href="#">a.dark</a>
        <button class="button button-dark">button.dark</button>
        <button class="button button-dark hover">hover</button>
        <button class="button button-dark activated">activated</button>
      </div>

      <h2>With Properties</h2>

      <div>
        <button primary>button.primary</button>
        <button secondary>button.secondary</button>
        <button stable>button.stable</button>
        <button light>button.light</button>
        <button dark>button.dark</button>
        <button danger>button.danger</button>
      </div>
    </p>

  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, Button]
})
export class ButtonPage {
  constructor(nav: NavController) {
    this.nav = nav;
    window.nav = nav;
  }
}

import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {List, Item, Input, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Cards</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Forms</h2>
    <p>
      Forms help you gather important information from the user, like
      login information or content to send to your server.
    </p>
    <p>
      Ionic comes with a variety of useful from controls, like
      text inputs, text areas, toggle switches, and sliders.
    </p>
    <form (^submit)="doSubmit($event)" [control-group]="form">
      <ion-input>
        <input control="email" type="email" placeholder="Your email">
      </ion-input>
      <ion-input>
        <input control="password" type="password" placeholder="Your password">
      </ion-input>
      <button ion-button primary block type="submit">Submit</button>
    </form>
  </ion-content>
  `,
  directives: [formDirectives, NavbarTemplate, Navbar, Content, List, Item, Input, Button]
})
export class FormPage {
  constructor() {
    var fb = new FormBuilder()

    this.form = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  doSubmit(event) {
    console.log('Submitted:', this.form.value);
    event.preventDefault();
  }
}

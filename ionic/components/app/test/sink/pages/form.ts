import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/angular2';

import {IonicApp, IonicView} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Form</ion-title></ion-navbar>

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
    <form (^submit)="doSubmit($event)" [ng-form-model]="form">
      <ion-input>
        <input ng-control="email" type="email" placeholder="Your email">
      </ion-input>
      <ion-input>
        <input control="password" type="password" placeholder="Your password">
      </ion-input>
      <button ion-button primary block type="submit">Submit</button>
    </form>
  </ion-content>
  `
})
export class FormPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);

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

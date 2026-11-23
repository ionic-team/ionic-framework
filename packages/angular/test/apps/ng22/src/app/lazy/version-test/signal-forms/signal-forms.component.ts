import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { IonicModule } from '@ionic/angular/lazy';

@Component({
  selector: 'app-signal-forms',
  standalone: true,
  imports: [FormField, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Signal Forms</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-input id="name" label="Name" errorText="Name is required" [formField]="signupForm.name"></ion-input>
      <ion-checkbox id="terms" [formField]="signupForm.terms">Accept terms</ion-checkbox>
      <ion-toggle id="notifications" [formField]="signupForm.notifications">Notifications</ion-toggle>
      <ion-button id="submit" (click)="signupForm().markAsTouched()">Submit</ion-button>
      <ion-button id="check-all" (click)="checkAll()">Check all</ion-button>
    </ion-content>
  `,
})
export class SignalFormsComponent {
  model = signal({ name: '', terms: false, notifications: false });

  signupForm = form(this.model, (path) => {
    required(path.name);
  });

  checkAll() {
    this.model.update((model) => ({ ...model, terms: true, notifications: true }));
  }
}

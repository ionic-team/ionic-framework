import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from '@ionic/angular';

import { UserData } from '../providers/user-data';

import { UserOptions } from '../interfaces/user-options';


@Component({
  selector: 'page-user',
  templateUrl: 'sign-up.html',
  styleUrls: ['./sign-up.scss']
})
export class SignUpPage {
  signup: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.username);
      // this.navCtrl.push(TabsPage);
    }
  }
}

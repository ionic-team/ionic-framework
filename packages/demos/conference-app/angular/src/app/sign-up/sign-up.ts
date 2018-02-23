import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private userData: UserData) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.signup(this.signup.username).then(() => {
        return this.router.navigateByUrl('/app/tabs/(schedule:schedule)');
      });
    }
  }
}

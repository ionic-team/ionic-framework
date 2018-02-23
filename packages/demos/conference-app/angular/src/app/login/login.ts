import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../providers/user-data';
import { UserOptions } from '../interfaces/user-options';


@Component({
  selector: 'page-user',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    private router: Router,
    private userData: UserData) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.login.username).then(() => {
        return this.router.navigateByUrl('/app/tabs/(schedule:schedule)');
      });
    }
  }

  onSignup() {
    return this.router.navigateByUrl('/sign-up');
  }
}

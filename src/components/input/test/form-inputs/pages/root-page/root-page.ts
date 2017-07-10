import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  loginForm: any;
  userForm: any;

  login = {
    email: 'help@ionic.io',
    username: 'admin',
    password: '',
    gender: '',
    comments: ''
  };

  submitted: boolean = false;
  isTextAreaDisabled: boolean;

  constructor(fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([
        Validators.required,
        this.emailValidator
      ])],
      username: [''],
      password: ['', Validators.required],
      comments: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.userForm = fb.group({
      email: ['', Validators.required],
      username: [{value: 'administrator', disabled: true}, Validators.required],
      password: [{value: 'password', disabled: false}, Validators.required],
      comments: [{value: 'Comments are disabled', disabled: true}, Validators.required]
    });
  }

  emailValidator(control: any) {
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }

  submit(_: UIEvent, value?: any) {
    console.log('Submitted', value);
    this.submitted = true;
  }

  disable() {
    this.isTextAreaDisabled = !this.isTextAreaDisabled;
  }

  toggleDisable() {
    let userNameCtrl = this.userForm.get('username');
    userNameCtrl.enabled ? userNameCtrl.disable() : userNameCtrl.enable();

    let commentsCtrl = this.userForm.get('comments');
    commentsCtrl.enabled ? commentsCtrl.disable() : commentsCtrl.enable();
  }

}

import { FormBuilder, Validators } from '@angular/forms';
import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
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

  submit(ev: UIEvent, value?: any) {
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

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EPage
  ]
})
export class AppModule {}

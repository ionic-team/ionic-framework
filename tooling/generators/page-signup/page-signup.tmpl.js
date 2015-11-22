import {FormBuilder, Validators} from 'angular2/angular2';
import {Page, NavController} from 'ionic/ionic';


@Page({
  templateUrl: 'app/<%= fileName %>/<%= fileName %>.html'
})
export class <%= jsClassName %> {
  constructor(nav: NavController) {
    this.nav = nav;

    var fb = new FormBuilder();

    this.signupForm = fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  doLogin() {
    this.nav.pop()
  }

  doSignup() {
    console.log(this.signupForm.value);

    this.nav.push(AppPage);
  }

}

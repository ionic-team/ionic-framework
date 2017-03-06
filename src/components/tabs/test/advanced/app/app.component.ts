import { Component } from '@angular/core';
import { SignIn } from '../pages/signin-page/signIn';
@Component({
  template: '<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>'
})
export class E2EApp {
  rootPage = SignIn;
}

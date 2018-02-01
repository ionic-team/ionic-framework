import { Component } from '@angular/core';
import { SignInPage } from '../pages/signin-page/sign-in-page';

@Component({
  template: '<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>'
})
export class AppComponent {
  rootPage = SignInPage;
}

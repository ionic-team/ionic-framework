import { Component } from '@angular/core';
import { DeepLink } from '../../../../../..';

@DeepLink({
  name: 'sign-in'
})
@Component({
  templateUrl: './sign-in-page.html'
})
export class SignInPage {
  tabsPage = 'tabs-page';
}

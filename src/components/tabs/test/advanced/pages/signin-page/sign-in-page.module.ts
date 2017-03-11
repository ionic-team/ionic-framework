import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { SignInPage } from './sign-in-page';

@NgModule({
  declarations: [
    SignInPage,
  ],
  imports: [
    DeepLinkModule.forChild(SignInPage)
  ]
})
export class SignInPageModule {}

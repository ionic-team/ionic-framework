import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SignInPage } from './sign-in-page';

@NgModule({
  declarations: [
    SignInPage,
  ],
  imports: [
    IonicPageModule.forChild(SignInPage)
  ]
})
export class SignInPageModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SignInPage } from './sign-in-page';

@NgModule({
  declarations: [
    SignInPage,
  ],
  imports: [
    IonicPageModule.forChild(SignInPage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignInPageModule {}

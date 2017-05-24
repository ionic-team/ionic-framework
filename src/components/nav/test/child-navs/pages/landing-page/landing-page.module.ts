import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { LandingPage } from './landing-page';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    IonicPageModule.forChild(LandingPage)
  ],
  entryComponents: [
    LandingPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingPageModule {}

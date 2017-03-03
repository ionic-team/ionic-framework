import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { LandingPage } from './landing-page';

@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    DeepLinkModule.forChild(LandingPage)
  ],
  entryComponents: [
    LandingPage,
  ]
})
export class LandingPageModule {}

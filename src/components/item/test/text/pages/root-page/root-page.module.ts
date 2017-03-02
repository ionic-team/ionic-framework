import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { RootPage } from './root-page';

@NgModule({
  declarations: [
    RootPage,
  ],
  imports: [
    DeepLinkModule.forChild(RootPage)
  ],
  entryComponents: [
    RootPage,
  ]
})
export class RootPageModule {}

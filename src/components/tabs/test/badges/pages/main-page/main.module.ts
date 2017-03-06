import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { E2EPage } from './main';

@NgModule({
  declarations: [
    E2EPage,
  ],
  imports: [
    DeepLinkModule.forChild(E2EPage)
  ],
  entryComponents: [
    E2EPage,
  ]
})
export class E2EPageModule {}

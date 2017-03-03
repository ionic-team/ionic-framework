import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { SecondPage } from './second-page';

@NgModule({
  declarations: [
    SecondPage,
  ],
  imports: [
    DeepLinkModule.forChild(SecondPage)
  ],
  entryComponents: [
    SecondPage,
  ]
})
export class SecondPageModule {}

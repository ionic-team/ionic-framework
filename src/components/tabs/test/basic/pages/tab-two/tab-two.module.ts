import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabTwo } from './tab-two';

@NgModule({
  declarations: [
    TabTwo,
  ],
  imports: [
    DeepLinkModule.forChild(TabTwo)
  ]
})
export class TabTwoModule {}

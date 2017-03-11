import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabThree } from './tab-three';

@NgModule({
  declarations: [
    TabThree,
  ],
  imports: [
    DeepLinkModule.forChild(TabThree)
  ]
})
export class TabThreeModule {}

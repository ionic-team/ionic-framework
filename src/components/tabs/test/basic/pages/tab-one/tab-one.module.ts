import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { TabOne } from './tab-one';

@NgModule({
  declarations: [
    TabOne,
  ],
  imports: [
    DeepLinkModule.forChild(TabOne)
  ]
})
export class TabOneModule {}

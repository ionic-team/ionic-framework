import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageOne } from './page-one';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    IonicPageModule.forChild(PageOne),
  ],
  entryComponents: [
    PageOne,
  ]
})
export class PageOneModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageOne } from './page-one';

import { SomeData } from './provider-one';
import { OtherData } from './provider-two';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    IonicPageModule.forChild(PageOne),
  ],
  entryComponents: [
    PageOne,
  ],
  providers: [
    SomeData,
    OtherData
  ]
})
export class PageOneModule {}

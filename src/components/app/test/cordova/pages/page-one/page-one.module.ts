import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageOneModule {}

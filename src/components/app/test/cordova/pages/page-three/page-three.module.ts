import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageThree } from './page-three';

@NgModule({
  declarations: [
    PageThree,
  ],
  imports: [
    IonicPageModule.forChild(PageThree)
  ],
  entryComponents: [
    PageThree,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageThreeModule {}

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { RootPage } from './root-page';
import { MyImgModule } from '../my-img/my-img.module';

@NgModule({
  declarations: [
    RootPage,
  ],
  imports: [
    IonicPageModule.forChild(RootPage),
    MyImgModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RootPageModule {}

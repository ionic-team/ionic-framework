import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { FirstPage } from './first-page';

import { MyCmpTest } from './my-component';
import { MyCmpTest2 } from './my-component-two';

@NgModule({
  imports: [
    IonicPageModule.forChild(FirstPage)
  ],
  declarations: [
    FirstPage,
    MyCmpTest,
    MyCmpTest2
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirstPageModule { }

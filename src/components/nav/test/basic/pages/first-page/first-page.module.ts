import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { FirstPage } from './first-page';

import { MyCmpTest } from './my-component';
import { MyCmpTest2 } from './my-component-two';

@NgModule({
  imports: [
    DeepLinkModule.forChild(FirstPage)
  ],
  declarations: [
    FirstPage,
    MyCmpTest,
    MyCmpTest2
  ]
})
export class FirstPageModule { }

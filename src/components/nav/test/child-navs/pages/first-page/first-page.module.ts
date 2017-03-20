import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { FirstPage } from './first-page';

@NgModule({
  declarations: [
    FirstPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstPage)
  ],
  entryComponents: [
    FirstPage,
  ]
})
export class FirstPageModule {}

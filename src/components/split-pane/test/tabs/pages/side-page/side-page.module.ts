import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SidePage } from './side-page';

@NgModule({
  declarations: [
    SidePage,
  ],
  imports: [
    IonicPageModule.forChild(SidePage)
  ]
})
export class SidePageModule {}

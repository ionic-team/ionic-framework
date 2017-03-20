import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { SecondPage } from './second-page';

@NgModule({
  declarations: [
    SecondPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondPage)
  ],
  entryComponents: [
    SecondPage,
  ]
})
export class SecondPageModule {}

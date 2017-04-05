import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { E2EPage } from './main';

@NgModule({
  declarations: [
    E2EPage,
  ],
  imports: [
    IonicPageModule.forChild(E2EPage)
  ],
  entryComponents: [
    E2EPage,
  ]
})
export class E2EPageModule {}

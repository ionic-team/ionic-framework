import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { CustomInnerComponent } from './custom-component';

@NgModule({
  declarations: [
    CustomInnerComponent,
  ],
  imports: [
    IonicPageModule.forChild(CustomInnerComponent)
  ]
})
export class CustomInnerComponentModule {}


import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab3Page1 } from './tab3-page1';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab3Page1)
  ],
  declarations: [
    Tab3Page1
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3Page1Module { }

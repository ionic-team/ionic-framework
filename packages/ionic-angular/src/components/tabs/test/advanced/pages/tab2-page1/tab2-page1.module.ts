import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab2Page1 } from './tab2-page1';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab2Page1)
  ],
  declarations: [
    Tab2Page1
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page1Module { }

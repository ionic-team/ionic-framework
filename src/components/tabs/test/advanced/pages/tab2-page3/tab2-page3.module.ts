import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab2Page3 } from './tab2-page3';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab2Page3)
  ],
  declarations: [
    Tab2Page3
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page3Module { }

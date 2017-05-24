import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab1Page3 } from './tab1-page3';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab1Page3)
  ],
  declarations: [
    Tab1Page3
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page3Module { }

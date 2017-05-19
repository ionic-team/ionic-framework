
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab1Page1 } from './tab1-page1';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab1Page1)
  ],
  declarations: [
    Tab1Page1
  ],
  entryComponents: [
    Tab1Page1,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page1Module { }

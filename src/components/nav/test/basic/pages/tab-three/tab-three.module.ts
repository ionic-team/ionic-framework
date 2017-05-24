import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { Tab3 } from './tab-three';


@NgModule({
  imports: [
    IonicPageModule.forChild(Tab3)
  ],
  declarations: [
    Tab3
  ],
  entryComponents: [
    Tab3,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3Module { }

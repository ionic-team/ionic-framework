import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { FirstPage } from './first-page';

@NgModule({
  imports: [
    IonicPageModule.forChild(FirstPage)
  ],
  declarations: [
    FirstPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FirstPageModule { }

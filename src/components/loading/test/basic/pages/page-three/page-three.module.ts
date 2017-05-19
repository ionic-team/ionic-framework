import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { PageThree } from './page-three';

@NgModule({
  imports: [
    IonicPageModule.forChild(PageThree)
  ],
  declarations: [
    PageThree
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageThreeModule { }

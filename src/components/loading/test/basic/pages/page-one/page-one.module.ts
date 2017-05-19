import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { PageOne } from './page-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(PageOne)
  ],
  declarations: [
    PageOne
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageOneModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { PageTwo } from './page-two';

@NgModule({
  imports: [
    IonicPageModule.forChild(PageTwo)
  ],
  declarations: [
    PageTwo
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageTwoModule { }

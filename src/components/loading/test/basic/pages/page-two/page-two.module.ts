import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { PageTwo } from './page-two';

@NgModule({
  imports: [
    DeepLinkModule.forChild(PageTwo)
  ],
  declarations: [
    PageTwo
  ],
})
export class PageTwoModule { }

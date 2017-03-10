import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { PageOne } from './page-one';

@NgModule({
  imports: [
    DeepLinkModule.forChild(PageOne)
  ],
  declarations: [
    PageOne
  ],
})
export class PageOneModule { }

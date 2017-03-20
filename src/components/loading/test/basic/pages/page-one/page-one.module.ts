import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { PageOne } from './page-one';

@NgModule({
  imports: [
    IonicPageModule.forChild(PageOne)
  ],
  declarations: [
    PageOne
  ],
})
export class PageOneModule { }

import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { Page3 } from './page3';

@NgModule({
  imports: [
    DeepLinkModule.forChild(Page3)
  ],
  declarations: [
    Page3
  ],
  entryComponents: [
    Page3,
  ]
})
export class Page3Module { }

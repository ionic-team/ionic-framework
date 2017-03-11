import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { PageThree } from './page-three';

@NgModule({
  imports: [
    DeepLinkModule.forChild(PageThree)
  ],
  declarations: [
    PageThree
  ]
})
export class PageThreeModule { }

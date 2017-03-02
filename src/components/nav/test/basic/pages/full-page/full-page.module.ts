import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { FullPage } from './full-page';


@NgModule({
  imports: [
    DeepLinkModule.forChild(FullPage)
  ],
  declarations: [
    FullPage
  ],
  entryComponents: [
    FullPage,
  ]
})
export class FullPageModule { }

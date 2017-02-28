import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { PrimaryHeaderPage } from './primary-header-page';


@NgModule({
  imports: [
    DeepLinkModule.forChild(PrimaryHeaderPage)
  ],
  declarations: [
    PrimaryHeaderPage
  ],
  entryComponents: [
    PrimaryHeaderPage,
  ]
})
export class PrimaryHeaderPageModule { }

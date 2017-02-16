import { NgModule } from '@angular/core';
import { IonicModule } from '../../../../../..';
import { FullPage } from './full-page';


@NgModule({
  imports: [
    IonicModule.forChild(FullPage)
  ],
  declarations: [
    FullPage
  ],
  entryComponents: [
    FullPage,
  ]
})
export class LinkModule { }

import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { RedirectPage } from './redirect-page';


@NgModule({
  imports: [
    IonicPageModule.forChild(RedirectPage)
  ],
  declarations: [
    RedirectPage
  ],
  entryComponents: [
    RedirectPage,
  ]
})
export class RedirectPageModule { }

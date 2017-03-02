import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';
import { RedirectPage } from './redirect-page';


@NgModule({
  imports: [
    DeepLinkModule.forChild(RedirectPage)
  ],
  declarations: [
    RedirectPage
  ],
  entryComponents: [
    RedirectPage,
  ]
})
export class RedirectPageModule { }

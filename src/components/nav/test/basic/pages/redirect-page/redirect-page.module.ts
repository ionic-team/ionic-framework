import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RedirectPageModule { }

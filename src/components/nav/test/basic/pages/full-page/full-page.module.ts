import { NgModule } from '@angular/core';
import { IonicModule } from '../../../../../../';
import { FullPage } from './full-page';


@NgModule({
  declarations: [
    FullPage
  ],
  imports: [
    IonicModule.forChild(FullPage)
  ],
  // bootstrap: [IonicApp],
  entryComponents: [
    FullPage,
  ]
})
export class LinkModule {}

import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
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
export default class LinkModule {}

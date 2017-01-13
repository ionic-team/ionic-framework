import { NgModule } from '@angular/core';
import { FullPage } from './full-page';


@NgModule({
  declarations: [
    FullPage
  ],
  imports: [
    // IonicModule.forRoot(E2EApp, {
    //   swipeBackEnabled: true
    // }, deepLinkConfig)
  ],
  // bootstrap: [IonicApp],
  entryComponents: [
    FullPage,
  ]
})
export class LinkModule {}

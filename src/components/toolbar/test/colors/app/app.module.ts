import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../../../';

import { RootPage } from '../pages/root-page/root-page';

@NgModule({
  declarations: [
    RootPage
  ],
  imports: [
    IonicModule.forRoot(RootPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    RootPage
  ]
})
export class AppModule {}

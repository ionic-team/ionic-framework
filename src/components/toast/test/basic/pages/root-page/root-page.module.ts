import { NgModule } from '@angular/core';
import { RootPage } from './root-page';
import { DeepLinkModule } from '../../../../../../';

@NgModule({
  declarations: [
    RootPage
  ],
  imports: [
    DeepLinkModule.forChild(RootPage)
  ],
  entryComponents: [
    RootPage
  ],
  providers: []
})
export class RootPageModule {}

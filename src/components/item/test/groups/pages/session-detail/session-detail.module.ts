import { NgModule } from '@angular/core';
import { SessionDetail } from './session-detail';
import { DeepLinkModule } from '../../../../../..';

@NgModule({
  declarations: [
    SessionDetail
  ],
  imports: [
    DeepLinkModule.forChild(SessionDetail)
  ],
  entryComponents: [
    SessionDetail
  ],
  providers: []
})
export class SessionDetailModule {}

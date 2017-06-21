import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SessionDetail } from './session-detail';
import { IonicPageModule } from '../../../../../..';

@NgModule({
  declarations: [
    SessionDetail
  ],
  imports: [
    IonicPageModule.forChild(SessionDetail)
  ],
  entryComponents: [
    SessionDetail
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SessionDetailModule {}

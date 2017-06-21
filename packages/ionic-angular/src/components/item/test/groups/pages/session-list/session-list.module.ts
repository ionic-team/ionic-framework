import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SessionList } from './session-list';
import { IonicPageModule } from '../../../../../..';

@NgModule({
  declarations: [
    SessionList
  ],
  imports: [
    IonicPageModule.forChild(SessionList)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SessionListModule {}

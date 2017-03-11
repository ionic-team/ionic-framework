import { NgModule } from '@angular/core';
import { SessionList } from './session-list';
import { DeepLinkModule } from '../../../../../..';

@NgModule({
  declarations: [
    SessionList
  ],
  imports: [
    DeepLinkModule.forChild(SessionList)
  ]
})
export class SessionListModule {}

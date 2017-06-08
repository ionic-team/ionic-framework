import { AssistivePopover } from './assistive-popover';
import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../../../module';
import { AssistiveTouchProvider } from '../../../providers/assistive-touch/assistive-touch';

@NgModule({
  declarations: [
    AssistivePopover,
  ],
  imports: [
    IonicPageModule.forChild(AssistivePopover),
  ],
  exports: [
    AssistivePopover
  ],
  providers: [
    AssistiveTouchProvider
  ]
})
export class AssistivePopoverModule {
}

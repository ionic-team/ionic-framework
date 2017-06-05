import { NgModule } from '@angular/core';
import { AssistiveTouchComponent } from './assistive-touch';
import { IonicPageModule } from '../../../../../../module';
import { AssistiveTouchProvider } from '../../providers/assistive-touch/assistive-touch';

@NgModule({
  declarations: [
    AssistiveTouchComponent,
  ],
  imports: [
    IonicPageModule.forChild(AssistiveTouchComponent),
  ],
  exports: [
    AssistiveTouchComponent
  ],
  providers: [
    AssistiveTouchProvider
  ]
})
export class AssistiveTouchComponentModule {
}

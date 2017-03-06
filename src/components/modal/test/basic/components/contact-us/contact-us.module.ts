import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ContactUsModal } from './contact-us';

@NgModule({
  declarations: [
    ContactUsModal,
  ],
  imports: [
    DeepLinkModule.forChild(ContactUsModal)
  ],
  entryComponents: [
    ContactUsModal,
  ]
})
export class ContactUsModalModule {}

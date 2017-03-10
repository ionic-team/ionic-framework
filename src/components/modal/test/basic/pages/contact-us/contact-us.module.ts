import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ContactUs } from './contact-us';

@NgModule({
  declarations: [
    ContactUs,
  ],
  imports: [
    DeepLinkModule.forChild(ContactUs)
  ]
})
export class ContactUsModule {}

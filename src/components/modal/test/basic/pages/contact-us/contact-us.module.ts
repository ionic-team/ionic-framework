import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ContactUs } from './contact-us';

@NgModule({
  declarations: [
    ContactUs,
  ],
  imports: [
    IonicPageModule.forChild(ContactUs)
  ]
})
export class ContactUsModule {}

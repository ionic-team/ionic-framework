import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ContentPageComponent } from './content-page.component';
import { ContentRoutingModule } from './content-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ContentRoutingModule
  ],
  declarations: [ContentPageComponent]
})
export class ContentModule { }

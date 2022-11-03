import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RangeComponent } from './range.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: RangeComponent }
    ])
  ]
})
export class RangeRoutingModule { }

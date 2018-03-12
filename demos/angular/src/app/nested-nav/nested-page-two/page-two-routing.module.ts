import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageTwo } from './page-two';
import { PageTwoSectionOne } from './page-two-section-one';
import { PageTwoSectionTwo } from './page-two-section-two';

const routes: Routes = [
  {
    path: '',
    component: PageTwo,
    children: [
      {
        path: 'section-one',
        component: PageTwoSectionOne,
      },
      {
        path: 'section-two',
        component: PageTwoSectionTwo,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageTwoRoutingModule { }

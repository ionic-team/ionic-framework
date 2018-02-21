import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpPage } from './sign-up';

const routes: Routes = [
  { path: '', component: SignUpPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpPageRoutingModule { }

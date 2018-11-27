import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputsTestComponent } from './inputs-test/inputs-test.component';

const routes: Routes = [
  {
    path: 'inputs-test',
    component: InputsTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

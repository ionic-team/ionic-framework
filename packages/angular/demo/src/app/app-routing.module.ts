import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'basic-inputs', loadChildren: 'app/basic-inputs/basic-inputs.module#BasicInputsModule' },
  { path: 'home', loadChildren: 'app/home/home.module#HomeModule' },
  { path: 'alert', loadChildren: 'app/alert/alert.module#AlertModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

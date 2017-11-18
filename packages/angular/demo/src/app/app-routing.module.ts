import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'basic-inputs', loadChildren: 'app/basic-inputs-page/basic-inputs-page.module#BasicInputsPageModule' },
  { path: 'group-inputs', loadChildren: 'app/group-inputs-page/group-inputs-page.module#GroupInputsPageModule' },
  { path: 'home', loadChildren: 'app/home-page/home-page.module#HomePageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

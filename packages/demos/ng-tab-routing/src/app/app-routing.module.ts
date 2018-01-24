import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/page-one', pathMatch: 'full' },
  { path: 'simple-nav', loadChildren: 'app/simple-nav/simple-nav.module#SimpleNavModule'},
  /*{ path: 'page-one', loadChildren: 'app/page-one/page-one.module#PageOneModule' },
  { path: 'page-two', loadChildren: 'app/page-two/page-two.module#PageTwoModule' },
  { path: 'page-three', loadChildren: 'app/page-three/page-three.module#PageThreeModule' }
  */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/account', pathMatch: 'full' },
  { path: 'account', loadChildren: './account/account.module#AccountModule' },
  { path: 'support', loadChildren: './support/support.module#SupportModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpModule' },
  // { path: 'app', loadChildren: './tabs-page/tabs-page.module#TabsModule' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavThenTabsPageComponent } from './nav-then-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: NavThenTabsPageComponent,
    children: [
      { path: 'login', loadChildren: './login/login.module#LoginModule' },
      { path: 'app', loadChildren: './tabs-page/tabs-page.module#TabsPageModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavThenTabsRoutingModule { }

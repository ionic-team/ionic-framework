import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputsComponent } from './inputs/inputs.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkComponent } from './router-link/router-link.component';
import { RouterLinkPageComponent } from './router-link-page/router-link-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabsTab1Component } from './tabs-tab1/tabs-tab1.component';
import { TabsTab1NestedComponent } from './tabs-tab1-nested/tabs-tab1-nested.component';
import { TabsTab2Component } from './tabs-tab2/tabs-tab2.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'inputs', component: InputsComponent },
  { path: 'modals', component: ModalComponent },
  { path: 'router-link', component: RouterLinkComponent },
  { path: 'router-link-page', component: RouterLinkPageComponent },
  { path: 'tabs', redirectTo: '/tabs/account', pathMatch: 'full' },
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'account',
        children: [
          {
            path: 'nested/:id',
            component: TabsTab1NestedComponent
          },
          {
            path: '',
            component: TabsTab1Component
          }
        ]
      },
      {
        path: 'contact',
        children: [
          {
            path: 'one',
            component: TabsTab2Component
          },
          {
            path: '',
            redirectTo: 'one',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'lazy',
        loadChildren: './tabs-lazy/tabs-lazy.module#TabsLazyModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

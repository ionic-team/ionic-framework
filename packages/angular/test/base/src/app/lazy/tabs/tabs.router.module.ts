import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { TabsTab1NestedComponent } from '../tabs-tab1-nested/tabs-tab1-nested.component';
import { TabsTab1Component } from '../tabs-tab1/tabs-tab1.component';
import { TabsTab2Component } from '../tabs-tab2/tabs-tab2.component';

const routes: Routes = [
  {
    path: '',
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
        loadChildren: () => import('../tabs-lazy/tabs-lazy.module').then(m => m.TabsLazyModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}

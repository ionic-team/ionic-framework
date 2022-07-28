import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'global',
        loadChildren: () => import('./global/global.module').then(m => m.GlobalModule)
      },
      {
        path: 'tabs',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule)
      },
      {
        path: '',
        redirectTo: 'tabs',
      }
    ])
  ]
})
export class TopRouterOutletRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tab1',
        loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1Module)
      },
      {
        path: '',
        redirectTo: 'tab1'
      }
    ])
  ],
  exports: [RouterModule]
})
export class TabsRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Tab1Child1Component } from "./tab1-child1/tab1-child1.component";
import { Tab1Child2Component } from "./tab1-child2/tab1-child2.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'child1',
        component: Tab1Child1Component
      },
      {
        path: 'child2',
        component: Tab1Child2Component
      },
      {
        path: '',
        redirectTo: 'child1',
      }
    ])
  ],
  exports: [RouterModule]
})
export class Tab1RoutingModule { }

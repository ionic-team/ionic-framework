import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TabsGlobalComponent } from "./tabs-global.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TabsGlobalComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class TabsGlobalRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ModalDynamicWrapperComponent } from ".";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ModalDynamicWrapperComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ModalDynamicWrapperRoutingModule { }

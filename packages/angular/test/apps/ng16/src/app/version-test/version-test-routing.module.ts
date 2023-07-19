import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'modal-nav-params',
        loadComponent: () => import('./modal-nav-params/modal-nav-params.component').then(m => m.ModalNavParamsComponent),
      },
      {
        path: 'bind-route/:id',
        data: {
          title: 'data:bindToComponentInputs'
        },
        resolve: {
          name: () => 'resolve:bindToComponentInputs'
        },
        loadComponent: () => import('./bind-component-inputs/bind-component-inputs.component').then(c => c.BindComponentInputsComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class VersionTestRoutingModule { }

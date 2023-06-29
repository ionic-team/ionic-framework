import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'modal-nav-params',
        loadComponent: () => import('./modal-nav-params/modal-nav-params.component').then(m => m.ModalNavParamsComponent)
      }
    ])
  ],
  exports: [RouterModule]
})
export class VersionTestRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
<<<<<<< refs/remotes/origin/main:packages/angular/test/apps/ng16/src/app/version-test/version-test-routing.module.ts
        path: 'modal-nav-params',
        loadComponent: () => import('./modal-nav-params/modal-nav-params.component').then(m => m.ModalNavParamsComponent)
=======
        path: 'bind-route/:id',
        data: {
          title: 'data:bindToComponentInputs'
        },
        resolve: {
          name: () => 'resolve:bindToComponentInputs'
        },
        loadComponent: () => import('./bind-component-inputs/bind-component-inputs.component').then(c => c.BindComponentInputsComponent)
>>>>>>> feat(angular): support binding routing data to component inputs:angular/test/apps/ng16/src/app/version-test/version-test-routing.module.ts
      }
    ])
  ],
  exports: [RouterModule]
})
export class VersionTestRoutingModule { }

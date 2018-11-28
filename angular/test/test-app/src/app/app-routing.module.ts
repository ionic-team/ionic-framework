import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputsComponent } from './inputs/inputs.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkComponent } from './router-link/router-link.component';
import { RouterLinkPageComponent } from './router-link-page/router-link-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'inputs', component: InputsComponent },
  { path: 'modals', component: ModalComponent },
  { path: 'router-link', component: RouterLinkComponent },
  { path: 'router-link-page', component: RouterLinkPageComponent },
  { path: 'tabs', component: TabsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

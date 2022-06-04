import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputsComponent } from './inputs/inputs.component';
import { ModalComponent } from './modal/modal.component';
import { RouterLinkComponent } from './router-link/router-link.component';
import { RouterLinkPageComponent } from './router-link-page/router-link-page.component';
import { RouterLinkPage2Component } from './router-link-page2/router-link-page2.component';
import { RouterLinkPage3Component } from './router-link-page3/router-link-page3.component';
import { HomePageComponent } from './home-page/home-page.component';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { VirtualScrollDetailComponent } from './virtual-scroll-detail/virtual-scroll-detail.component';
import { NestedOutletComponent } from './nested-outlet/nested-outlet.component';
import { NestedOutletPageComponent } from './nested-outlet-page/nested-outlet-page.component';
import { NestedOutletPage2Component } from './nested-outlet-page2/nested-outlet-page2.component';
import { ViewChildComponent } from './view-child/view-child.component';
import { ProvidersComponent } from './providers/providers.component';
import { SlidesComponent } from './slides/slides.component';
import { FormComponent } from './form/form.component';
import { NavigationPage1Component } from './navigation-page1/navigation-page1.component';
import { NavigationPage2Component } from './navigation-page2/navigation-page2.component';
import { NavigationPage3Component } from './navigation-page3/navigation-page3.component';
import { AlertComponent } from './alert/alert.component';
import { AccordionComponent } from './accordion/accordion.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'accordions', component: AccordionComponent },
  { path: 'alerts', component: AlertComponent },
  { path: 'inputs', component: InputsComponent },
  { path: 'form', component: FormComponent },
  { path: 'modals', component: ModalComponent },
  { path: 'modal-inline', loadChildren: () => import('./modal-inline').then(m => m.ModalInlineModule) },
  { path: 'view-child', component: ViewChildComponent },
  { path: 'popover-inline', loadChildren: () => import('./popover-inline').then(m => m.PopoverInlineModule) },
  { path: 'providers', component: ProvidersComponent },
  { path: 'router-link', component: RouterLinkComponent },
  { path: 'router-link-page', component: RouterLinkPageComponent },
  { path: 'router-link-page2/:id', component: RouterLinkPage2Component },
  { path: 'router-link-page3', component: RouterLinkPage3Component },
  { path: 'slides', component: SlidesComponent },
  { path: 'virtual-scroll', component: VirtualScrollComponent },
  { path: 'virtual-scroll-detail/:itemId', component: VirtualScrollDetailComponent },
  { path: 'tabs', redirectTo: '/tabs/account', pathMatch: 'full' },
  {
    path: 'navigation',
    children: [
      { path: 'page1', component: NavigationPage1Component },
      { path: 'page2', component: NavigationPage2Component },
      { path: 'page3', component: NavigationPage3Component }
    ]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'nested-outlet',
    component: NestedOutletComponent,
    children: [
      {
        path: 'page',
        component: NestedOutletPageComponent
      },
      {
        path: 'page2',
        component: NestedOutletPage2Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'popover', loadComponent: () => import('../popover/popover.component').then(c => c.PopoverComponent) },
      { path: 'modal', loadComponent: () => import('../modal/modal.component').then(c => c.ModalComponent) },
      { path: 'router-outlet', loadComponent: () => import('../router-outlet/router-outlet.component').then(c => c.RouterOutletComponent) },
      { path: 'back-button', loadComponent: () => import('../back-button/back-button.component').then(c => c.BackButtonComponent) },
      { path: 'router-link', loadComponent: () => import('../router-link/router-link.component').then(c => c.RouterLinkComponent) },
      { path: 'nav', loadComponent: () => import('../nav/nav.component').then(c => c.NavComponent) },
      { path: 'providers', loadComponent: () => import('../providers/providers.component').then(c => c.ProvidersComponent) },
      { path: 'overlay-controllers', loadComponent: () => import('../overlay-controllers/overlay-controllers.component').then(c => c.OverlayControllersComponent) },
      { path: 'button', loadComponent: () => import('../button/button.component').then(c => c.ButtonComponent) },
      { path: 'icon', loadComponent: () => import('../icon/icon.component').then(c => c.IconComponent) },
      { path: 'tabs', loadComponent: () => import('../tabs/tabs.component').then(c => c.TabsComponent) },
      {
        path: 'tabs',
        loadComponent: () => import('../tabs/tabs.component').then(c => c.TabsComponent),
        children: [
          { path: 'tab-one', loadComponent: () => import('../tabs/tab1.component').then(c => c.TabOneComponent) },
          { path: 'tab-two', loadComponent: () => import('../tabs/tab2.component').then(c => c.TabTwoComponent) },
          { path: 'tab-three', loadComponent: () => import('../tabs/tab3.component').then(c => c.TabThreeComponent) }
        ]
      },
    ]
  },
];

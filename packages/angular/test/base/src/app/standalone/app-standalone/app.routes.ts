import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'menu-controller', loadComponent: () => import('../menu-controller/menu-controller.component').then(c => c.MenuControllerComponent) },
      { path: 'popover', loadComponent: () => import('../popover/popover.component').then(c => c.PopoverComponent) },
      { path: 'modal', loadComponent: () => import('../modal/modal.component').then(c => c.ModalComponent) },
      { path: 'router-outlet', loadComponent: () => import('../router-outlet/router-outlet.component').then(c => c.RouterOutletComponent) },
      { path: 'back-button', loadComponent: () => import('../back-button/back-button.component').then(c => c.BackButtonComponent) },
      { path: 'router-link', loadComponent: () => import('../router-link/router-link.component').then(c => c.RouterLinkComponent) },
      { path: 'nav', loadComponent: () => import('../nav/nav.component').then(c => c.NavComponent) },
      { path: 'providers', loadComponent: () => import('../providers/providers.component').then(c => c.ProvidersComponent) },
      { path: 'providers/platform', loadComponent: () => import('../platform/platform.component').then(c => c.PlatformComponent) },
      { path: 'overlay-controllers', loadComponent: () => import('../overlay-controllers/overlay-controllers.component').then(c => c.OverlayControllersComponent) },
      { path: 'button', loadComponent: () => import('../button/button.component').then(c => c.ButtonComponent) },
      { path: 'icon', loadComponent: () => import('../icon/icon.component').then(c => c.IconComponent) },
      { path: 'tabs', redirectTo: '/standalone/tabs/tab-one', pathMatch: 'full' },
      {
        path: 'tabs',
        loadComponent: () => import('../tabs/tabs.component').then(c => c.TabsComponent),
        children: [
          { path: 'tab-one', loadComponent: () => import('../tabs/tab1.component').then(c => c.TabOneComponent) },
          { path: 'tab-two', loadComponent: () => import('../tabs/tab2.component').then(c => c.TabTwoComponent) },
          { path: 'tab-three', loadComponent: () => import('../tabs/tab3.component').then(c => c.TabThreeComponent) }
        ]
      },
      {
        path: 'value-accessors',
        children: [
          { path: 'checkbox', loadComponent: () => import('../value-accessors/checkbox/checkbox.component').then(c => c.CheckboxComponent) },
          { path: 'datetime', loadComponent: () => import('../value-accessors/datetime/datetime.component').then(c => c.DatetimeComponent) },
          { path: 'input', loadComponent: () => import('../value-accessors/input/input.component').then(c => c.InputComponent) },
          { path: 'radio-group', loadComponent: () => import('../value-accessors/radio-group/radio-group.component').then(c => c.RadioGroupComponent) },
          { path: 'range', loadComponent: () => import('../value-accessors/range/range.component').then(c => c.RangeComponent) },
          { path: 'searchbar', loadComponent: () => import('../value-accessors/searchbar/searchbar.component').then(c => c.SearchbarComponent) },
          { path: 'segment', loadComponent: () => import('../value-accessors/segment/segment.component').then(c => c.SegmentComponent) },
          { path: 'select', loadComponent: () => import('../value-accessors/select/select.component').then(c => c.SelectComponent) },
          { path: 'textarea', loadComponent: () => import('../value-accessors/textarea/textarea.component').then(c => c.TextareaComponent) },
          { path: 'toggle', loadComponent: () => import('../value-accessors/toggle/toggle.component').then(c => c.ToggleComponent) },
          { path: '**', redirectTo: 'checkbox' }
        ]
      }
    ]
  },
];

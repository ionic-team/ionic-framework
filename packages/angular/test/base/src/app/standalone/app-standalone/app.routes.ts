import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', loadComponent: () => import('../home-page/home-page.component').then(c => c.HomePageComponent) },
      { path: 'menu-controller', loadComponent: () => import('../menu-controller/menu-controller.component').then(c => c.MenuControllerComponent) },
      { path: 'action-sheet-controller', loadComponent: () => import('../action-sheet-controller/action-sheet-controller.component').then(c => c.ActionSheetControllerComponent) },
      { path: 'popover', loadComponent: () => import('../popover/popover.component').then(c => c.PopoverComponent) },
      { path: 'modal', loadComponent: () => import('../modal/modal.component').then(c => c.ModalComponent) },
      { path: 'modal-sheet-inline', loadComponent: () => import('../modal-sheet-inline/modal-sheet-inline.component').then(c => c.ModalSheetInlineComponent) },
      { path: 'modal-dynamic-wrapper', loadComponent: () => import('../modal-dynamic-wrapper/modal-dynamic-wrapper.component').then(c => c.ModalDynamicWrapperComponent) },
      { path: 'modal-child-route', redirectTo: '/standalone/modal-child-route/child', pathMatch: 'full' },
      {
        path: 'modal-child-route',
        loadComponent: () => import('../modal-child-route/modal-child-route-parent.component').then(c => c.ModalChildRouteParentComponent),
        children: [
          { path: 'child', loadComponent: () => import('../modal-child-route/modal-child-route-child.component').then(c => c.ModalChildRouteChildComponent) },
        ]
      },
      { path: 'programmatic-modal', loadComponent: () => import('../programmatic-modal/programmatic-modal.component').then(c => c.ProgrammaticModalComponent) },
      { path: 'router-outlet', loadComponent: () => import('../router-outlet/router-outlet.component').then(c => c.RouterOutletComponent) },
      { path: 'back-button', loadComponent: () => import('../back-button/back-button.component').then(c => c.BackButtonComponent) },
      { path: 'router-link', loadComponent: () => import('../router-link/router-link.component').then(c => c.RouterLinkComponent) },
      { path: 'nav', loadComponent: () => import('../nav/nav.component').then(c => c.NavComponent) },
      { path: 'providers', loadComponent: () => import('../providers/providers.component').then(c => c.ProvidersComponent) },
      { path: 'overlay-controllers', loadComponent: () => import('../overlay-controllers/overlay-controllers.component').then(c => c.OverlayControllersComponent) },
      { path: 'button', loadComponent: () => import('../button/button.component').then(c => c.ButtonComponent) },
      { path: 'reorder-group', loadComponent: () => import('../reorder-group/reorder-group.component').then(c => c.ReorderGroupComponent) },
      { path: 'icon', loadComponent: () => import('../icon/icon.component').then(c => c.IconComponent) },
      { path: 'split-pane', redirectTo: '/standalone/split-pane/inbox', pathMatch: 'full' },
      {
        path: 'split-pane',
        loadComponent: () => import('../split-pane/split-pane.component').then(c => c.SplitPaneComponent),
        children: [
          { path: ':id', loadComponent: () => import('../split-pane/split-pane-page.component').then(c => c.SplitPanePageComponent) },
        ]
      },
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
      { path: 'tabs-basic', loadComponent: () => import('../tabs-basic/tabs-basic.component').then(c => c.TabsBasicComponent) },
      {
        path: 'validation',
        children: [
          { path: 'input-validation', loadComponent: () => import('../validation/input-validation/input-validation.component').then(c => c.InputValidationComponent) },
          { path: 'textarea-validation', loadComponent: () => import('../validation/textarea-validation/textarea-validation.component').then(c => c.TextareaValidationComponent) },
          { path: 'select-validation', loadComponent: () => import('../validation/select-validation/select-validation.component').then(c => c.SelectValidationComponent) },
          { path: 'checkbox-validation', loadComponent: () => import('../validation/checkbox-validation/checkbox-validation.component').then(c => c.CheckboxValidationComponent) },
          { path: 'toggle-validation', loadComponent: () => import('../validation/toggle-validation/toggle-validation.component').then(c => c.ToggleValidationComponent) },
          { path: 'radio-group-validation', loadComponent: () => import('../validation/radio-group-validation/radio-group-validation.component').then(c => c.RadioGroupValidationComponent) },
          { path: '**', redirectTo: 'input-validation' }
        ]
      },
      {
        path: 'value-accessors',
        children: [
          { path: 'checkbox', loadComponent: () => import('../value-accessors/checkbox/checkbox.component').then(c => c.CheckboxComponent) },
          { path: 'datetime', loadComponent: () => import('../value-accessors/datetime/datetime.component').then(c => c.DatetimeComponent) },
          { path: 'input', loadComponent: () => import('../value-accessors/input/input.component').then(c => c.InputComponent) },
          { path: 'input-otp', loadComponent: () => import('../value-accessors/input-otp/input-otp.component').then(c => c.InputOtpComponent) },
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

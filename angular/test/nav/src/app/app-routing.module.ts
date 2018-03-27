import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'basic-inputs', loadChildren: 'app/basic-inputs-page/basic-inputs-page.module#BasicInputsPageModule' },
  { path: 'show-hide-when', loadChildren: 'app/show-hide-when/show-hide-when.module#ShowHideWhenModule' },
  { path: 'form-sample', loadChildren: 'app/form-sample-page/form-sample-page.module#FormSamplePageModule' },
  { path: 'group-inputs', loadChildren: 'app/group-inputs-page/group-inputs-page.module#GroupInputsPageModule' },
  { path: 'home', loadChildren: 'app/home-page/home-page.module#HomePageModule' },
  { path: 'alert', loadChildren: 'app/alert/alert.module#AlertModule' },
  { path: 'actionSheet', loadChildren: 'app/action-sheet/action-sheet.module#ActionSheetModule' },
  { path: 'badge', loadChildren: 'app/badge/badge.module#BadgeModule' },
  { path: 'card', loadChildren: 'app/card/card.module#CardModule' },
  { path: 'content', loadChildren: 'app/content/content.module#ContentModule' },
  { path: 'toast', loadChildren: 'app/toast/toast.module#ToastModule' },
  { path: 'loading', loadChildren: 'app/loading/loading.module#LoadingModule' },
  { path: 'modal', loadChildren: 'app/modal/modal.module#ModalModule' },
  { path: 'popover', loadChildren: 'app/popover/popover.module#PopoverModule' },
  { path: 'segment', loadChildren: 'app/segment/segment.module#SegmentModule' },
  { path: 'virtual-scroll', loadChildren: 'app/virtual-scroll/virtual-scroll.module#VirtualScrollModule' },

  { path: 'no-routing-nav', loadChildren: 'app/no-routing-nav/no-routing-nav.module#NoRoutingNavModule' },
  { path: 'simple-nav', loadChildren: 'app/simple-nav/simple-nav.module#SimpleNavModule' },
  { path: 'static-tabs', loadChildren: 'app/static-tabs/tabs.module#TabsModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'basic-inputs', loadChildren: './basic-inputs-page/basic-inputs-page.module#BasicInputsPageModule' },
  { path: 'show-hide-when', loadChildren: './show-hide-when/show-hide-when.module#ShowHideWhenModule' },
  { path: 'form-sample', loadChildren: './form-sample-page/form-sample-page.module#FormSamplePageModule' },
  { path: 'group-inputs', loadChildren: './group-inputs-page/group-inputs-page.module#GroupInputsPageModule' },
  { path: 'home', loadChildren: './home-page/home-page.module#HomePageModule' },
  { path: 'alert', loadChildren: './alert/alert.module#AlertModule' },
  { path: 'actionSheet', loadChildren: './action-sheet/action-sheet.module#ActionSheetModule' },
  { path: 'badge', loadChildren: './badge/badge.module#BadgeModule' },
  { path: 'card', loadChildren: './card/card.module#CardModule' },
  { path: 'content', loadChildren: './content/content.module#ContentModule' },
  { path: 'toast', loadChildren: './toast/toast.module#ToastModule' },
  { path: 'loading', loadChildren: './loading/loading.module#LoadingModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalModule' },
  { path: 'ng-if', loadChildren: './ng-if/ng-if.module#NgIfModule' },
  { path: 'popover', loadChildren: './popover/popover.module#PopoverModule' },
  { path: 'segment', loadChildren: './segment/segment.module#SegmentModule' },
  { path: 'virtual-scroll', loadChildren: './virtual-scroll/virtual-scroll.module#VirtualScrollModule' },

  { path: 'no-routing-nav', loadChildren: './no-routing-nav/no-routing-nav.module#NoRoutingNavModule' },
  { path: 'simple-nav', loadChildren: './simple-nav/simple-nav.module#SimpleNavModule' },
  { path: 'lazy-load-tabs', loadChildren: './lazy-load-tabs/tabs.module#TabsModule' },
  { path: 'simple-tabs', loadChildren: './simple-tabs/tabs.module#TabsModule' },
  { path: 'static-tabs', loadChildren: './static-tabs/tabs.module#TabsModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

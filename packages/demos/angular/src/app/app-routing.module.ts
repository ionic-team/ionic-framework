import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'basic-inputs', loadChildren: 'app/basic-inputs-page/basic-inputs-page.module#BasicInputsPageModule' },
  { path: 'group-inputs', loadChildren: 'app/group-inputs-page/group-inputs-page.module#GroupInputsPageModule' },
  { path: 'home', loadChildren: 'app/home-page/home-page.module#HomePageModule' },
  { path: 'alert', loadChildren: 'app/alert/alert.module#AlertModule' },
  { path: 'actionSheet', loadChildren: 'app/action-sheet/action-sheet.module#ActionSheetModule' },
  { path: 'badge', loadChildren: 'app/badge/badge.module#BadgeModule' },
  { path: 'card', loadChildren: 'app/card/card.module#CardModule' },
  { path: 'content', loadChildren: 'app/content/content.module#ContentModule' },
  { path: 'toast', loadChildren: 'app/toast/toast.module#ToastModule' },
  { path: 'loading', loadChildren: 'app/loading/loading.module#LoadingModule' },
  { path: 'no-routing-nav', loadChildren: 'app/no-routing-nav/no-routing-nav.module#NoRoutingNavModule' },
  { path: 'modal', loadChildren: 'app/modal/modal.module#ModalModule' },
  { path: 'popover', loadChildren: 'app/popover/popover.module#PopoverModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import {
  TabsOutletInitComponent,
  TabsOutletInitTabOneComponent,
  TabsOutletInitTabTwoComponent,
} from './tabs-outlet-init.component';

const routes: Routes = [
  {
    path: '',
    component: TabsOutletInitComponent,
    children: [
      { path: 'tab-one', component: TabsOutletInitTabOneComponent },
      { path: 'tab-two', component: TabsOutletInitTabTwoComponent },
    ],
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [TabsOutletInitComponent, TabsOutletInitTabOneComponent, TabsOutletInitTabTwoComponent],
})
export class TabsOutletInitModule {}

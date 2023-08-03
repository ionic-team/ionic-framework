import { Component } from '@angular/core';
import { IonNav } from '@ionic/angular/standalone';
import { AngularDelegate } from '@ionic/angular/common';

import { PageOneComponent } from './page-one.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [IonNav],
  // TODO FW-4766: Remove AngularDelegate from providers
  providers: [AngularDelegate]
})
export class NavComponent {
  component = PageOneComponent;
}

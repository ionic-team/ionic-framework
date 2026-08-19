import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ModeSwitcherComponent } from './mode-switcher.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, ModeSwitcherComponent]
})
export class AppStandaloneComponent {
}

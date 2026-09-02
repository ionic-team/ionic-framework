import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ModeSwitcherComponent } from './mode-switcher.component';

@Component({
  selector: 'app-root',
  // Angular 22 defaults to OnPush, and a tick stops at a clean OnPush view.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, ModeSwitcherComponent],
})
export class AppStandaloneComponent {
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ModeSwitcherComponent } from './mode-switcher.component';

@Component({
  selector: 'app-root',
  // A tick won't descend past a clean OnPush view, which is Angular 22's default (#31406).
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, ModeSwitcherComponent],
})
export class AppStandaloneComponent {
}

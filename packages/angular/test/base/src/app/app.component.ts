import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // Angular 22 defaults to OnPush, and a tick stops at a clean OnPush view.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
}

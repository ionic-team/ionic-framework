import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // A tick won't descend past a clean OnPush view, which is Angular 22's default (#31406).
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
}

import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Same page inside `ion-tabs`, which hosts its own `ion-router-outlet` and so
 * puts one more Ionic view between the app and the page.
 */
@Component({
  selector: 'app-async-change-detection-tabs',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './async-change-detection-tabs.component.html',
  standalone: false,
})
export class AsyncChangeDetectionTabsComponent {}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

import { isZoneChangeDetection } from '../../zone-assert.util';

/**
 * IonicModule counterpart of the standalone async change detection page, so the
 * lazy `ion-router-outlet` and `ion-tabs` are covered too.
 * Verifies issue https://github.com/ionic-team/ionic-framework/issues/31406
 */
@Component({
  selector: 'app-async-change-detection',
  // An OnPush page wouldn't re-render on a plain field mutation either, so the
  // test would pass or fail for the wrong reason.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './async-change-detection.component.html',
  standalone: false,
})
export class AsyncChangeDetectionComponent {
  private changeDetectorRef = inject(ChangeDetectorRef);

  status = 'idle';

  readonly changeDetection = isZoneChangeDetection() ? 'zone' : 'zoneless';

  async run() {
    this.status = 'pending';
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.status = 'settled';
  }

  markForCheck() {
    this.changeDetectorRef.markForCheck();
  }
}

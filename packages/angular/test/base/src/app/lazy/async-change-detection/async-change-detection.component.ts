import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject } from '@angular/core';

import { isZoneChangeDetection } from '../../zone-assert.util';

/**
 * IonicModule counterpart of the standalone async change detection page, so the
 * lazy `ion-router-outlet` and `ion-tabs` are covered too.
 * Verifies issue https://github.com/ionic-team/ionic-framework/issues/31406
 */
@Component({
  selector: 'app-async-change-detection',
  // An OnPush page wouldn't re-render on a plain field mutation at all, so the
  // test would no longer be about the outlet.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './async-change-detection.component.html',
  standalone: false,
})
export class AsyncChangeDetectionComponent {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef<HTMLElement>);

  status = 'idle';

  readonly changeDetection = isZoneChangeDetection() ? 'zone' : 'zoneless';

  async run() {
    this.elementRef.nativeElement.removeAttribute('data-async-update-complete');
    this.status = 'pending';
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.status = 'settled';
    this.elementRef.nativeElement.setAttribute('data-async-update-complete', 'true');
  }

  markForCheck() {
    this.changeDetectorRef.markForCheck();
  }
}

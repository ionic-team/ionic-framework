import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular';

import { isZoneChangeDetection } from '../../zone-assert.util';

/**
 * Mutates a plain field after an `await`. Under Zone.js the DOM catches up on
 * its own, and zoneless it stays stale until the view is marked. Renders inside
 * an `ion-router-outlet`, so it only updates if the outlet lets a tick through.
 * Verifies issue https://github.com/ionic-team/ionic-framework/issues/31406
 */
@Component({
  selector: 'app-async-change-detection',
  // An OnPush page wouldn't re-render on a plain field mutation either, so the
  // test would pass or fail for the wrong reason.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './async-change-detection.component.html',
  standalone: true,
  imports: [IonContent, IonButton],
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

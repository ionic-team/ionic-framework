import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular';

import { isZoneChangeDetection } from '../../zone-assert.util';

/**
 * Mutates a plain field after an `await`. Under Zone.js the DOM catches up on
 * its own, and zoneless it stays stale until the view is marked. Renders inside
 * an `ion-router-outlet`, so it only updates if the outlet lets a tick through.
 */
@Component({
  selector: 'app-async-change-detection',
  // An OnPush page wouldn't re-render on a plain field mutation at all, so the
  // test would no longer be about the outlet.
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './async-change-detection.component.html',
  standalone: true,
  imports: [IonContent, IonButton],
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

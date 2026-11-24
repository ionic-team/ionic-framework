import { AfterViewInit, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';

/**
 * Renders `ion-tabs` behind an `@if` that becomes true after the page has
 * rendered, so the router has already activated the tab route by the time
 * `ion-tabs` is created. The inner outlet then activates the tab while
 * `IonTabs` is still in its first change detection, and the first
 * `ionTabsWillChange` fires before its `outlet` view query has resolved.
 *
 * Issue: https://github.com/ionic-team/ionic-framework/issues/31674
 */
@Component({
  selector: 'app-tabs-outlet-ready',
  // Angular 22 defaults to OnPush, and a tick stops at a clean OnPush view.
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (showTabs()) {
      <ion-tabs #tabs (ionTabsWillChange)="onTabsWillChange(tabs)">
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="tab-one">
            <ion-label>Tab One</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    }
    <div id="test">
      <p id="outlet-defined">
        Outlet defined on first ionTabsWillChange: <span>{{ outletDefined() }}</span>
      </p>
    </div>
  `,
  standalone: true,
  imports: [IonLabel, IonTabBar, IonTabButton, IonTabs],
})
export class TabsOutletReadyComponent implements AfterViewInit {
  showTabs = signal(false);

  outletDefined = signal<boolean | undefined>(undefined);

  ngAfterViewInit() {
    setTimeout(() => this.showTabs.set(true));
  }

  onTabsWillChange(tabs: IonTabs) {
    // Only record the first event.
    if (this.outletDefined() !== undefined) {
      return;
    }

    this.outletDefined.set(tabs.outlet?.nativeEl !== undefined);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonTabs } from '@ionic/angular/lazy';

@Component({
  selector: 'app-tabs-outlet-init',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
  template: `
    <button type="button" id="show-tabs" (click)="showTabs = true">Show Tabs</button>
    <ion-tabs *ngIf="showTabs" #tabs (ionTabsWillChange)="onWillChange($event, tabs)">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab-one">
          <ion-label>Tab One</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab-two">
          <ion-label>Tab Two</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <div id="will-change-log">{{ willChangeLog.join(',') }}</div>
  `,
})
export class TabsOutletInitComponent {
  showTabs = false;
  willChangeLog: string[] = [];

  onWillChange(ev: { tab: string }, tabs: IonTabs) {
    this.willChangeLog.push(`${ev.tab}:${Boolean(tabs.outlet?.nativeEl)}:${String(tabs.getSelected())}`);
  }
}

@Component({
  selector: 'app-tabs-outlet-init-tab-one',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
  template: 'Tab 1',
})
export class TabsOutletInitTabOneComponent {}

@Component({
  selector: 'app-tabs-outlet-init-tab-two',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
  template: 'Tab 2',
})
export class TabsOutletInitTabTwoComponent {}

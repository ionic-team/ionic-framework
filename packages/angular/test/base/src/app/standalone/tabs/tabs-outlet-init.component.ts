import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs-outlet-init',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [NgIf, IonLabel, IonTabBar, IonTabButton, IonTabs],
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

import { Component } from "@angular/core";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import type { RefresherEventDetail, RefresherPullEndEventDetail } from '@ionic/core';

@Component({
  selector: 'app-refresher',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Refresher Test</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-refresher
        slot="fixed"
        (ionPullStart)="onPullStart()"
        (ionRefresh)="onRefresh($event)"
        (ionPullEnd)="onPullEnd($event)"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-list>
        <ion-item>
          <ion-label>
            ionPullStart count: <span id="pull-start-count">{{ pullStartCount }}</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            ionRefresh count: <span id="refresh-count">{{ refreshCount }}</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            ionPullEnd count: <span id="pull-end-count">{{ pullEndCount }}</span>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            ionPullEnd reason: <span id="pull-end-reason">{{ pullEndReason }}</span>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonTitle, IonToolbar]
})
export class RefresherComponent {
  pullStartCount = 0;
  refreshCount = 0;
  pullEndCount = 0;
  pullEndReason = '';

  onPullStart() {
    this.pullStartCount++;
  }

  onRefresh(event: CustomEvent<RefresherEventDetail>) {
    this.refreshCount++;
    (event.target as HTMLIonRefresherElement | null)?.complete();
  }

  onPullEnd(event: CustomEvent<RefresherPullEndEventDetail>) {
    this.pullEndCount++;
    this.pullEndReason = event.detail.reason;
  }
}

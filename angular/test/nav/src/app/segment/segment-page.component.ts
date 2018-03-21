import { Component } from '@angular/core';

@Component({
  selector: 'app-segment-page',
  template: `
  <ion-app>
      <ion-header>
        <ion-toolbar>
          <ion-segment id="segment" [(ngModel)]="relationship" (ionChange)="onSegmentChanged($event)">
            <ion-segment-button value="friends" (ionSelect)="onSegmentSelected($event)" class="e2eSegmentFriends">
              Friends
            </ion-segment-button>
            <ion-segment-button value="enemies" (ionSelect)="onSegmentSelected($event)">
              Enemies
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
        <ion-toolbar>
          <ion-buttons slot="mode-end">
            <ion-button>
              <ion-icon slot="icon-only" name="search"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-segment [(ngModel)]="icons" color="secondary">
            <ion-segment-button value="camera">
              <ion-icon name="camera"></ion-icon>
            </ion-segment-button>
            <ion-segment-button value="bookmark">
              <ion-icon name="bookmark"></ion-icon>
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-header>
      <ion-content padding>
        <h4>Model style: NgModel</h4>
        <ion-segment [(ngModel)]="modelStyle" color="dark" [disabled]="isDisabledS">
          <ion-segment-button value="A">
            Model A
          </ion-segment-button>
          <ion-segment-button value="B">
            Model B
          </ion-segment-button>
          <ion-segment-button value="C" class="e2eSegmentModelC">
            Model C
          </ion-segment-button>
          <ion-segment-button value="D" [disabled]="isDisabledB">
            Model D
          </ion-segment-button>
        </ion-segment>
        <p>Model Style: <b>Model {{ modelStyle }}</b></p>
        <ion-segment [(ngModel)]="icons">
          <ion-segment-button value="camera">
            <ion-icon name="camera"></ion-icon>
          </ion-segment-button>
          <ion-segment-button value="bookmark">
            <ion-icon name="bookmark"></ion-icon>
          </ion-segment-button>
        </ion-segment>
        <ion-button color="dark" (click)="toggleBDisabled()">Toggle Button Disabled</ion-button>
        <ion-button color="dark" (click)="toggleSDisabled()">Toggle Segment Disabled</ion-button>

        <ion-item>
          <ion-label>Period Days</ion-label>
          <ion-select [(ngModel)]="valve.periodDays" (ionChange)="periodDaysChange(valve)">
            <ion-select-option value="1">1 Day</ion-select-option>
            <ion-select-option value="2">2 Days</ion-select-option>
            <ion-select-option value="3">3 Days</ion-select-option>
            <ion-select-option value="4">4 Days</ion-select-option>
            <ion-select-option value="5">5 Days</ion-select-option>
            <ion-select-option value="6">6 Days</ion-select-option>
            <ion-select-option value="7">7 Days</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-segment [(ngModel)]="valve.selectDay">
          <ion-segment-button *ngFor="let info of valve.daysInfo" value="{{info.day}}">{{info.day+1}}th day</ion-segment-button>
        </ion-segment>
      </ion-content>

      <ion-footer>
        <ion-toolbar color="primary">
          <ion-segment [(ngModel)]="appType" color="light">
            <ion-segment-button value="paid">
              Primary
            </ion-segment-button>
            <ion-segment-button value="free">
              Toolbar
            </ion-segment-button>
            <ion-segment-button value="top" class="e2eSegmentTopGrossing">
              Light Segment
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
        <ion-toolbar>
          <ion-segment [(ngModel)]="appType" color="danger">
            <ion-segment-button value="paid">
              Default
            </ion-segment-button>
            <ion-segment-button value="free">
              Toolbar
            </ion-segment-button>
            <ion-segment-button value="top">
              Danger Segment
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
        <ion-toolbar>
          <ion-segment [(ngModel)]="appType" color="dark" [disabled]="isDisabledS">
            <ion-segment-button value="paid">
              Default
            </ion-segment-button>
            <ion-segment-button value="free">
              Toolbar
            </ion-segment-button>
            <ion-segment-button value="top">
              Dark Segment
            </ion-segment-button>
          </ion-segment>
        </ion-toolbar>
      </ion-footer>
</ion-app>
  `
})
export class SegmentPageComponent {
  relationship: string = 'friends';
  modelStyle: string = 'B';
  appType: string = 'free';
  icons: string = 'camera';
  isDisabledB: boolean = true;
  isDisabledS: boolean = false;

  valve = {
    daysInfo: [],
    selectDay: '0',
    periodDays: 3
  }

  constructor() {
    this.periodDaysChange(this.valve);
  }

  periodDaysChange(valve) {
    valve.periodDays = parseInt(valve.periodDays);
    if (valve.daysInfo.length < valve.periodDays) {
      for (let i = valve.daysInfo.length; i < valve.periodDays; ++i) {
        valve.daysInfo.push({day:i, intervals:[]});
      }
    } else if (valve.daysInfo.length > valve.periodDays) {
      valve.daysInfo = valve.daysInfo.slice(0, valve.periodDays);
    }
  }

  addDays(valve) {
    valve.periodDays += 1;
    this.periodDaysChange(valve);
  }

  toggleBDisabled() {
    this.isDisabledB = !this.isDisabledB;
  }

  toggleSDisabled() {
    this.isDisabledS = !this.isDisabledS;
  }

  onSegmentChanged(segmentButton: any) {
    console.log('Segment changed to', segmentButton.currentTarget.value);
  }

  onSegmentSelected(segmentButton: any) {
    console.log('Segment selected', segmentButton.currentTarget.value);
  }
}

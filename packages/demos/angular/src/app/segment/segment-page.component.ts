import { Component } from '@angular/core';

@Component({
  selector: 'app-segment-page',
  template: `
  <ion-app>
    <ion-page class="show-page">
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
  </ion-page>
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

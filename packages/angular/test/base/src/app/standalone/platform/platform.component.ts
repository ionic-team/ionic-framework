import { Component, NgZone } from "@angular/core";

import { Platform } from '@ionic/angular/standalone';

@Component({
  selector: "app-platform",
  templateUrl: "./platform.component.html",
  standalone: true
})
export class PlatformComponent {

  isReady = false;
  isResumed = false;
  isPaused = false;
  isResized = false;

  constructor(public platform: Platform) {
    platform.ready().then(() => {
      NgZone.assertInAngularZone();
      this.isReady = true;
    });
    platform.resume.subscribe(() => {
      console.log('platform:resume');
      NgZone.assertInAngularZone();
      this.isResumed = true;
    });
    platform.pause.subscribe(() => {
      console.log('platform:pause');
      NgZone.assertInAngularZone();
      this.isPaused = true;
    });
    platform.resize.subscribe(() => {
      console.log('platform:resize');
      NgZone.assertInAngularZone();
      this.isResized = true;
    });
  }

}

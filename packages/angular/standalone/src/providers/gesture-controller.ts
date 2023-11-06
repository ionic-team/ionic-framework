import { Injectable, NgZone } from '@angular/core';
import { GestureController as GestureControllerBase } from '@ionic/angular/common';
import { createGesture } from '@ionic/core/components';

@Injectable({
  providedIn: 'root',
})
export class GestureController extends GestureControllerBase {
  constructor(ngZone: NgZone) {
    super(ngZone, createGesture);
  }
}

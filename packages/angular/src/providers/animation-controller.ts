import { Injectable } from '@angular/core';
import { AnimationController as AnimationControllerBase } from '@ionic/angular/common';
import { createAnimation, getTimeGivenProgression } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationController extends AnimationControllerBase {
  constructor() {
    super(createAnimation, getTimeGivenProgression);
  }
}

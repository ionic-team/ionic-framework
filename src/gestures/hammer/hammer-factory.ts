import { ElementRef, Injectable } from '@angular/core';

import * as Hammer from 'hammerjs';

export class HammerFactory {

  createDefaultHammerInstance(elementRef: ElementRef) {
    return new Hammer(elementRef.nativeElement);
  }

  createHammerManager(elementRef: ElementRef) {
    return new Hammer.Manager(elementRef.nativeElement);
  }

  createPanGestureRecognizer(opts: any) {
    return new Hammer.Pan(opts);
  }

  createPinchGestureRecognizer(opts: any) {
    return new Hammer.Tap(opts);
  }

  createPressGestureRecognizer(opts: any) {
    return new Hammer.Tap(opts);
  }

  createRotateGestureRecognizer(opts: any) {
    return new Hammer.Swipe(opts);
  }

  createSwipeGestureRecognizer(opts: any) {
    return new Hammer.Swipe(opts);
  }

  createTapGestureRecognizer(opts: any) {
    return new Hammer.Tap(opts);
  }
}

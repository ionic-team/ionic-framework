import { ElementRef, Injectable } from '@angular/core';

import * as Hammer from 'hammerjs';

export class HammerFactory {
  constructor(){
  }

  createDefaultHammerInstance(elementRef: ElementRef) {
    return new Hammer(elementRef.nativeElement);
  }

  createHammerManager(elementRef: ElementRef) {
    return new Hammer.Manager(elementRef.nativeElement);
  }

  createPanGestureRecognizer(opts: any) {
    return new Hammer.Pan(opts);
  }

  createSwipeGestureRecognizer(opts: any) {
    return new Hammer.Swipe(opts);
  }

  createTapGestureRecognizer(opts: any) {
    return new Hammer.Tap(opts);
  }
}

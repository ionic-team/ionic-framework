import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, BaseHammerGesture} from './base-gesture';
import {HammerFactory} from './hammer-factory';

export class SwipeGesture extends BaseHammerGesture {

  private onSwipeHandler: (event: HammerInput) => any;

  private _onSwipeHandlerInternal = (event: HammerInput) => {
    this.onSwipeHandlerInternal(event);
  }

  constructor(delegate: GestureDelegate, hammerFactory: HammerFactory, elementRef: ElementRef, options: SwipeGestureOptions) {
    super(delegate, hammerFactory, hammerFactory.createSwipeGestureRecognizer, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('swipe', this._onSwipeHandlerInternal);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('swipe', this._onSwipeHandlerInternal);
  }

  onSwipeHandlerInternal(event: HammerInput) {
    try {

      if ( ! this.delegate ) {
        throw new Error('Delegate missing');
      }

      if ( this.started ) {
        throw new Error('Already started');
      }

      if ( this.captured ) {
        throw new Error('Already captured');
      }

      this.delegate.release();

      this.started = this.delegate.start();
      if ( !this.started ) {
        throw new Error('Failed to start');
      }

      this.captured = this.delegate.capture();

      if ( ! this.captured ) {
        throw new CaptureError('Failed to capture');
      }

      if ( this.onSwipeHandler ) {
        this.onSwipeHandler(event);
      }

    }
    catch (ex) {
      console.debug(`onSwipeHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.notCaptured(event);
      }
    }
    finally {
      this.started = false;
      this.captured = false;
    }
  }

  pointerDown(event: HammerInput) {
    super.pointerDown(event);
    this.started = true;
  }

  onSwipe(handler: (event: HammerInput) => any) {
    this.onSwipeHandler = handler;
  }
}

export interface SwipeGestureOptions {
  threshold?: number;
  pointers?: number;
  direction?: GestureDirection;
  priority?: GesturePriority;
  disableScroll?: DisableScroll;
}

@Injectable()
export class SwipeGestureController {
  constructor(private gestureController: GestureController, private hammerFactory: HammerFactory) {
  }

  create(elementRef: ElementRef, options: SwipeGestureOptions) {
    // assign reasonable defaults
    options.direction = !!options.direction ? options.direction : GestureDirection.ALL;
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.DuringCapture;
    let delegate = this.gestureController.create(`swipe-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new SwipeGesture(delegate, this.hammerFactory, elementRef, options);
  }
}

let count = 0;

const DEFAULT_NUM_POINTERS = 1;
const DEFAULT_THRESHOLD = 10;

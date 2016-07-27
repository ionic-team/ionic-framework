import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, GestureRecognizer} from './gesture-recognizer';

export class SwipeGestureRecognizer extends GestureRecognizer {

  public onSwipe = new EventEmitter<HammerInput>();

  private _onSwipeHandler = (event: HammerInput) => {
    this.onSwipeHandler(event);
  }

  constructor(delegate: GestureDelegate, elementRef: ElementRef, options: SwipeGestureRecognizerOptions) {
    super(delegate, hammer.Swipe, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('swipe', this._onSwipeHandler);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('swipe', this._onSwipeHandler);
  }

  onSwipeHandler(event: HammerInput) {
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

      this.onSwipe.emit(event);

    }
    catch (ex) {
      console.log(`onSwipeHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.notCaptured(event);
      }
    }
    finally {
      this.started = false;
      this.captured = false;
    }
  }

  pointerDown(event: HammerInput){
    super.pointerDown(event);
    this.started = true;
  }
}

export interface SwipeGestureRecognizerOptions {
  threshold?: number,
  pointers?: number,
  direction?: GestureDirection,
  priority?: GesturePriority,
  disableScroll? : DisableScroll
}

@Injectable()
export class SwipeGestureRecognizerProvider {
  constructor(private gestureController: GestureController) {
  }

  create(elementRef:ElementRef, options: SwipeGestureRecognizerOptions) {
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

    return new SwipeGestureRecognizer(delegate, elementRef, options);
  }
}

let count = 0;

const DEFAULT_NUM_POINTERS: number = 1;
const DEFAULT_THRESHOLD: number = 10;

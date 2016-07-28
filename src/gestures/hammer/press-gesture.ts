import {ElementRef, EventEmitter, Injectable} from '@angular/core';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, BaseHammerGesture} from './base-gesture';
import {HammerFactory} from './hammer-factory';

export class PressGesture extends BaseHammerGesture {

  private onPressHandler: (event: HammerInput) => any;
  private onPressUpHandler: (event: HammerInput) => any;

  private _onPressHandlerInternal = (event: HammerInput) => {
    this.onPressHandlerInternal(event);
  }

  private _onPressUpHandlerInternal = (event: HammerInput) => {
    this.onPressUpHandlerInternal(event);
  }

  constructor(delegate: GestureDelegate, hammerFactory: HammerFactory, elementRef: ElementRef, options: PressGestureOptions) {
    super(delegate, hammerFactory, hammerFactory.createPressGestureRecognizer, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('press', this._onPressHandlerInternal);
    this.hammerManager.on('pressup', this._onPressUpHandlerInternal);
  }

  unlisten() {
    this.hammerManager.off('press', this._onPressHandlerInternal);
    this.hammerManager.off('pressup', this._onPressUpHandlerInternal);
    super.unlisten();
  }

  onPressHandlerInternal(event: HammerInput) {
    try {
      if ( this.started ) {
        throw new Error('Already started');
      }

      if ( this.captured ) {
        throw new Error('Already captured');
      }

      if ( ! this.delegate ) {
        throw new Error('Missing delegate');
      }

      this.delegate.release();
      this.started = this.delegate.start();

      if ( ! this.started ) {
        throw new Error('Failed to start');
      }

      this.captured = this.delegate.capture();

      if ( this.onPressHandler ) {
        this.onPressHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPressHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.notCaptured(event);
      }
    }
  }

  onPressUpHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( ! this.delegate ) {
        throw new Error('Missing delegate');
      }

      if ( this.onPressUpHandler ) {
        this.onPressUpHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPressUpHandler: Error occured - ${ex.message}`);
    }
    finally {
      this.delegate.release();
      this.started = false;
      this.captured = false;
    }
  }

  onPress(handler: (event: HammerInput) => any) {
    this.onPressHandler = handler;
  }

  onPressUp(handler: (event: HammerInput) => any) {
    this.onPressUpHandler = handler;
  }
}

export interface PressGestureOptions {
  pointers?: number;
  threshold?: number;
  time?: number;
  priority?: GesturePriority;
  disableScroll?: DisableScroll;
}

@Injectable()
export class PressGestureController {
  constructor(private gestureController: GestureController, private hammerFactory: HammerFactory) {
  }

  create(elementRef: ElementRef, options: PressGestureOptions) {
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.time = !!options.time ? options.time : DEFAULT_TIME;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.Never;
    let delegate = this.gestureController.create(`press-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new PressGesture(delegate, this.hammerFactory, elementRef, options);
  }
}

let count = 0;

const DEFAULT_NUM_POINTERS: number = 1;
const DEFAULT_TIME: number = 251;
const DEFAULT_THRESHOLD: number = 9;

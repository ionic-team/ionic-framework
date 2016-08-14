import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, BaseHammerGesture} from './base-gesture';
import {HammerFactory} from './hammer-factory';

export class TapGesture extends BaseHammerGesture {

  private onTapHandler: (event: HammerInput) => any;

  private _onTapHandlerInternal = (event: HammerInput) => {
    this.onTapHandlerInternal(event);
  }

  constructor(delegate: GestureDelegate, hammerFactory: HammerFactory, elementRef: ElementRef, options: TapGestureOptions) {
    super(delegate, hammerFactory, hammerFactory.createTapGestureRecognizer, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('tap', this._onTapHandlerInternal);
  }

  unlisten() {
    this.hammerManager.off('tap', this._onTapHandlerInternal);
    super.unlisten();
  }

  onTapHandlerInternal(event: HammerInput) {
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

      if ( ! this.captured ) {
        throw new CaptureError('Failed to capture');
      }
      
      if ( this.onTapHandler ) {
        this.onTapHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onTapHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.notCaptured(event);
      }
    }
    finally {
      this.delegate.release();
      this.started = false;
      this.captured = false;
    }
  }

  pointerDown(event: HammerInput) {
    try {
      if ( ! this.canStart(event) ) {
        throw new Error('Cannot start');
      }

      if ( ! this.delegate ) {
        throw new Error('Missing delegate');
      }
      this.recognizerEnabled = true;
    }
    catch (ex) {
        console.debug(`TapGestureRecognizer: Error occured during pointerdown - ${ex.message}`);
    }
  }

  pointerUp(event: HammerInput) {
    // taps utilize pointer down and pointer up, and there can be multiple taps, so don't use this
  }

  onTap(handler: (event: HammerInput) => any) {
    this.onTapHandler = handler;
  }
}

export interface TapGestureOptions {
  pointers?: number;
  taps?: number;
  interval?: number;
  time?: number;
  threshold?: number;
  posThreshold?: number;
  priority?: GesturePriority;
  disableScroll?: DisableScroll;
}

@Injectable()
export class TapGestureController {
  constructor(private gestureController: GestureController, private hammerFactory: HammerFactory) {
  }

  create(elementRef: ElementRef, options: TapGestureOptions) {
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.taps = !!options.taps ? options.taps : DEFAULT_NUM_TAPS;
    options.interval = !!options.interval ? options.interval : DEFAULT_INTERVAL;
    options.time = !!options.time ? options.time : DEFAULT_TIME;
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.posThreshold = !!options.posThreshold ? options.posThreshold : DEFAULT_POSITION_THRESHOLD;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.Never;
    let delegate = this.gestureController.create(`tap-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new TapGesture(delegate, this.hammerFactory, elementRef, options);
  }
}

let count = 0;

const DEFAULT_NUM_POINTERS = 1;
const DEFAULT_NUM_TAPS = 1;
const DEFAULT_INTERVAL = 300;
const DEFAULT_TIME = 250;
const DEFAULT_THRESHOLD = 2;
const DEFAULT_POSITION_THRESHOLD = 10;

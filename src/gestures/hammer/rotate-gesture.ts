import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, BaseHammerGesture} from './base-gesture';
import {HammerFactory} from './hammer-factory';

export class RotateGesture extends BaseHammerGesture {

  private onRotateStartHandler: (event: HammerInput) => any;
  private onRotateMoveHandler: (event: HammerInput) => any;
  private onRotateEndHandler: (event: HammerInput) => any;
  private onRotateCancelHandler: (event: HammerInput) => any;

  private _onRotateStartHandlerInternal = (event: HammerInput) => {
    this.onRotateStartHandlerInternal(event);
  }

  private _onRotateMoveHandlerInternal = (event: HammerInput) => {
    this.onRotateMoveHandlerInternal(event);
  }

  private _onRotateEndHandlerInternal = (event: HammerInput) => {
    this.onRotateEndHandlerInternal(event);
  }

  private _onRotateCancelHandlerInternal = (event: HammerInput) => {
    this.onRotateCancelHandlerInternal(event);
  }

  constructor(delegate: GestureDelegate, hammerFactory: HammerFactory, elementRef: ElementRef, options: RotateGestureOptions) {
    super(delegate, hammerFactory, hammerFactory.createRotateGestureRecognizer, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('rotatestart', this._onRotateStartHandlerInternal);
    this.hammerManager.on('rotatemove', this._onRotateMoveHandlerInternal);
    this.hammerManager.on('rotateend', this._onRotateEndHandlerInternal);
    this.hammerManager.on('rotatecancel', this._onRotateCancelHandlerInternal);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('rotatestart', this._onRotateStartHandlerInternal);
    this.hammerManager.off('rotatemove', this._onRotateMoveHandlerInternal);
    this.hammerManager.off('rotateend', this._onRotateEndHandlerInternal);
    this.hammerManager.off('rotatecancel', this._onRotateCancelHandlerInternal);
  }

  onRotateStartHandlerInternal(event: HammerInput) {
    try {
      if ( this.started ) {
        throw new Error('Already started');
      }

      if ( ! this.delegate ) {
        throw new Error('Delegate missing');
      }

      if ( this.captured ) {
        throw new Error('Already captured');
      }

      // release any existing gesture
      this.delegate.release();

      // try to start the gesture
      this.started = this.delegate.start();
      if ( ! this.started ) {
        throw new Error('Failed to start');
      }

      this.captured = this.delegate.capture();

      if ( ! this.captured ) {
        throw new CaptureError('Failed to capture');
      }

      if ( this.onRotateStartHandler ) {
        this.onRotateStartHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onRotateStartHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.started = false;
        this.captured = false;
      }
    }
  }

  onRotateMoveHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onRotateMoveHandler ) {
        this.onRotateMoveHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onRotateMoveHandler: Error occured - ${ex.message}`);
    }
  }

  onRotateEndHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onRotateEndHandler ) {
        this.onRotateEndHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onRotateEndHandler: Error occured - ${ex.message}`);
    }
    finally {
      if ( this.delegate ) {
        this.delegate.release();
      }
      this.started = false;
      this.captured = false;
    }
  }

  onRotateCancelHandlerInternal(event: HammerInput) {
    try {
      if ( this.onRotateCancelHandler ) {
        this.onRotateCancelHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onRotateCancelHandler: Error occured - ${ex.message}`);
    }
    finally {
      if ( this.delegate ) {
        this.delegate.release();
      }
      this.started = false;
      this.captured = false;
    }
  }

  onRotateStart(handler: (event: HammerInput) => any) {
    this.onRotateStartHandler = handler;
  }

  onRotateMove(handler: (event: HammerInput) => any) {
    this.onRotateMoveHandler = handler;
  }

  onRotateEnd(handler: (event: HammerInput) => any) {
    this.onRotateEndHandler = handler;
  }

  onRotateCancel(handler: (event: HammerInput) => any) {
    this.onRotateCancelHandler = handler;
  }
}

export interface RotateGestureOptions {
  threshold?: number;
  pointers?: number;
  priority?: GesturePriority;
  disableScroll?: DisableScroll;
}

@Injectable()
export class RotateGestureController {
  constructor(private gestureController: GestureController, private hammerFactory: HammerFactory) {
  }

  create(elementRef: ElementRef, options: RotateGestureOptions) {
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.DuringCapture;

    let delegate = this.gestureController.create(`rotate-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new RotateGesture(delegate, this.hammerFactory, elementRef, options);
  }
}

let count = 0;

const DEFAULT_THRESHOLD = 0;
const DEFAULT_NUM_POINTERS = 2;

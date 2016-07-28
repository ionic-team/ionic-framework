import {ElementRef, EventEmitter, Injectable} from '@angular/core';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, BaseHammerGesture} from './base-gesture';
import {HammerFactory} from './hammer-factory';

export class PinchGesture extends BaseHammerGesture {

  private onPinchStartHandler: (event: HammerInput) => any;
  private onPinchMoveHandler: (event: HammerInput) => any;
  private onPinchEndHandler: (event: HammerInput) => any;
  private onPinchCancelHandler: (event: HammerInput) => any;
  private onPinchInHandler: (event: HammerInput) => any;
  private onPinchOutHandler: (event: HammerInput) => any;

  private _onPinchStartHandlerInternal = (event: HammerInput) => {
    this.onPinchStartHandlerInternal(event);
  }

  private _onPinchMoveHandlerInternal = (event: HammerInput) => {
    this.onPinchMoveHandlerInternal(event);
  }

  private _onPinchEndHandlerInternal = (event: HammerInput) => {
    this.onPinchEndHandlerInternal(event);
  }

  private _onPinchCancelHandlerInternal = (event: HammerInput) => {
    this.onPinchCancelHandlerInternal(event);
  }

  private _onPinchInHandlerInternal = (event: HammerInput) => {
    this.onPinchInHandlerInternal(event);
  }

  private _onPinchOutHandlerInternal = (event: HammerInput) => {
    this.onPinchOutHandlerInternal(event);
  }

  constructor(delegate: GestureDelegate, hammerFactory: HammerFactory, elementRef: ElementRef, options: PinchGestureOptions) {
    super(delegate, hammerFactory, hammerFactory.createPinchGestureRecognizer, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('pinchstart', this._onPinchStartHandlerInternal);
    this.hammerManager.on('pinchmove', this._onPinchMoveHandlerInternal);
    this.hammerManager.on('pinchend', this._onPinchEndHandlerInternal);
    this.hammerManager.on('pinchcancel', this._onPinchCancelHandlerInternal);
    this.hammerManager.on('pinchin', this._onPinchInHandlerInternal);
    this.hammerManager.on('pinchout', this._onPinchOutHandlerInternal);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('pinchstart', this._onPinchStartHandlerInternal);
    this.hammerManager.off('pinchmove', this._onPinchMoveHandlerInternal);
    this.hammerManager.off('pinchend', this._onPinchEndHandlerInternal);
    this.hammerManager.off('pinchcancel', this._onPinchCancelHandlerInternal);
    this.hammerManager.off('pinchin', this._onPinchInHandlerInternal);
    this.hammerManager.off('pinchout', this._onPinchOutHandlerInternal);
  }

  onPinchStartHandlerInternal(event: HammerInput) {
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

      if ( this.onPinchStartHandler ) {
        this.onPinchStartHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPinchStartHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.started = false;
        this.captured = false;
      }
    }
  }

  onPinchMoveHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onPinchMoveHandler ) {
        this.onPinchMoveHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPinchMoveHandler: Error occured - ${ex.message}`);
    }
  }

  onPinchInHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onPinchInHandler ) {
        this.onPinchInHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPinchInHandler: Error occured - ${ex.message}`);
    }
  }

  onPinchOutHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onPinchOutHandler ) {
        this.onPinchOutHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPinchOutHandler: Error occured - ${ex.message}`);
    }
  }

  onPinchEndHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onPinchEndHandler ) {
        this.onPinchEndHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPinchEndHandler: Error occured - ${ex.message}`);
    }
    finally {
      if ( this.delegate ) {
        this.delegate.release();
      }
      this.started = false;
      this.captured = false;
    }
  }

  onPinchCancelHandlerInternal(event: HammerInput) {
    try {
      if ( this.onPinchCancelHandler ) {
        this.onPinchCancelHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPinchCancelHandler: Error occured - ${ex.message}`);
    }
    finally {
      if ( this.delegate ) {
        this.delegate.release();
      }
      this.started = false;
      this.captured = false;
    }
  }

  onPinchStart(handler: (event: HammerInput) => any) {
    this.onPinchStartHandler = handler;
  }

  onPinchMove(handler: (event: HammerInput) => any) {
    this.onPinchMoveHandler = handler;
  }

  onPinchEnd(handler: (event: HammerInput) => any) {
    this.onPinchEndHandler = handler;
  }

  onPinchCancel(handler: (event: HammerInput) => any) {
    this.onPinchCancelHandler = handler;
  }

  onPinchIn(handler: (event: HammerInput) => any) {
    this.onPinchInHandler = handler;
  }

  onPinchOut(handler: (event: HammerInput) => any) {
    this.onPinchOutHandler = handler;
  }
}

export interface PinchGestureOptions {
  threshold?: number;
  pointers?: number;
  priority?: GesturePriority;
  disableScroll?: DisableScroll;
}

@Injectable()
export class PinchGestureController {
  constructor(private gestureController: GestureController, private hammerFactory: HammerFactory) {
  }

  create(elementRef: ElementRef, options: PinchGestureOptions) {
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.DuringCapture;

    let delegate = this.gestureController.create(`pinch-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new PinchGesture(delegate, this.hammerFactory, elementRef, options);
  }
}

let count = 0;


const DEFAULT_THRESHOLD: number = 0;
const DEFAULT_NUM_POINTERS = 2;

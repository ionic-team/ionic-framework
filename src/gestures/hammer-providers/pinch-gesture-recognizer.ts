import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, GestureRecognizer} from './gesture-recognizer';

export class PinchGestureRecognizer extends GestureRecognizer {

  public onPinchStart = new EventEmitter<HammerInput>();
  public onPinchMove = new EventEmitter<HammerInput>();
  public onPinchEnd = new EventEmitter<HammerInput>();
  public onPinchCancel = new EventEmitter<HammerInput>();
  public onPinchIn = new EventEmitter<HammerInput>();
  public onPinchOut = new EventEmitter<HammerInput>();

  private _onPinchStartHandler = (event: HammerInput) => {
    this.onPinchStartHandler(event);
  }

  private _onPinchMoveHandler = (event: HammerInput) => {
    this.onPinchMoveHandler(event);
  }

  private _onPinchEndHandler = (event: HammerInput) => {
    this.onPinchEndHandler(event);
  }

  private _onPinchCancelHandler = (event: HammerInput) => {
    this.onPinchCancelHandler(event);
  }

  private _onPinchInHandler = (event: HammerInput) => {
    this.onPinchInHandler(event);
  }

  private _onPinchOutHandler = (event: HammerInput) => {
    this.onPinchOutHandler(event);
  }

  constructor(delegate: GestureDelegate, elementRef: ElementRef, options: PinchGestureRecognizerOptions) {
    super(delegate, hammer.Pinch, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('pinchstart', this._onPinchStartHandler);
    this.hammerManager.on('pinchmove', this._onPinchMoveHandler);
    this.hammerManager.on('pinchend', this._onPinchEndHandler);
    this.hammerManager.on('pinchcancel', this._onPinchCancelHandler);
    this.hammerManager.on('pinchin', this._onPinchInHandler);
    this.hammerManager.on('pinchout', this._onPinchOutHandler);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('pinchstart', this._onPinchStartHandler);
    this.hammerManager.off('pinchmove', this._onPinchMoveHandler);
    this.hammerManager.off('pinchend', this._onPinchEndHandler);
    this.hammerManager.off('pinchcancel', this._onPinchCancelHandler);
    this.hammerManager.off('pinchin', this._onPinchInHandler);
    this.hammerManager.off('pinchout', this._onPinchOutHandler);
  }

  onPinchStartHandler(event: HammerInput) {
    try {
      if ( this.started ) {
        throw new Error("Already started");
      }

      if ( ! this.delegate ) {
        throw new Error("Delegate missing");
      }

      if ( this.captured ) {
        throw new Error('Already captured');
      }

      // release any existing gesture
      this.delegate.release();

      // try to start the gesture
      this.started = this.delegate.start();
      if ( ! this.started ){
        throw new Error('Failed to start');
      }

      this.captured = this.delegate.capture();

      if ( ! this.captured ){
        throw new CaptureError("Failed to capture");
      }

      this.onPinchStart.emit(event);
    }
    catch (ex) {
      console.debug(`onPinchStartHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.started = false;
        this.captured = false;
      }
    }
  }

  onPinchMoveHandler(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      this.onPinchMove.emit(event);
    }
    catch (ex) {
      console.debug(`onPinchMoveHandler: Error occured - ${ex.message}`);
    }
  }

  onPinchInHandler(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      this.onPinchIn.emit(event);
    }
    catch (ex) {
      console.debug(`onPinchInHandler: Error occured - ${ex.message}`);
    }
  }

  onPinchOutHandler(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      this.onPinchOut.emit(event);
    }
    catch (ex) {
      console.debug(`onPinchOutHandler: Error occured - ${ex.message}`);
    }
  }

  onPinchEndHandler(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      this.onPinchEnd.emit(event);
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

  onPinchCancelHandler(event: HammerInput) {
    try {
      this.onPinchCancel.emit(event);
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
}

export interface PinchGestureRecognizerOptions {
  threshold?: number,
  pointers?: number,
  priority?: GesturePriority,
  disableScroll? : DisableScroll
}

@Injectable()
export class PinchGestureRecognizerProvider{
  constructor(private gestureController: GestureController) {
  }

  create(elementRef:ElementRef, options: PinchGestureRecognizerOptions) {
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.DuringCapture;

    let delegate = this.gestureController.create(`pinch-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new PinchGestureRecognizer(delegate, elementRef, options);
  }
}

let count = 0;


const DEFAULT_THRESHOLD: number = 0;
const DEFAULT_NUM_POINTERS = 2;

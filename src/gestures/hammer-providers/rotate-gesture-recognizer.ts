import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, GestureRecognizer} from './gesture-recognizer';

export class RotateGestureRecognizer extends GestureRecognizer {

  public onRotateStart = new EventEmitter<HammerInput>();
  public onRotateMove = new EventEmitter<HammerInput>();
  public onRotateEnd = new EventEmitter<HammerInput>();
  public onRotateCancel = new EventEmitter<HammerInput>();

  private _onRotateStartHandler = (event: HammerInput) => {
    this.onRotateStartHandler(event);
  }

  private _onRotateMoveHandler = (event: HammerInput) => {
    this.onRotateMoveHandler(event);
  }

  private _onRotateEndHandler = (event: HammerInput) => {
    this.onRotateEndHandler(event);
  }

  private _onRotateCancelHandler = (event: HammerInput) => {
    this.onRotateCancelHandler(event);
  }

  constructor(delegate: GestureDelegate, elementRef: ElementRef, options: RotateGestureRecognizerOptions) {
    super(delegate, hammer.Rotate, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('rotatestart', this._onRotateStartHandler);
    this.hammerManager.on('rotatemove', this._onRotateMoveHandler);
    this.hammerManager.on('rotateend', this._onRotateEndHandler);
    this.hammerManager.on('rotatecancel', this._onRotateCancelHandler);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('rotatestart', this._onRotateStartHandler);
    this.hammerManager.off('rotatemove', this._onRotateMoveHandler);
    this.hammerManager.off('rotateend', this._onRotateEndHandler);
    this.hammerManager.off('rotatecancel', this._onRotateCancelHandler);
  }

  onRotateStartHandler(event: HammerInput) {
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

      this.onRotateStart.emit(event);
    }
    catch (ex) {
      console.debug(`onRotateStartHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.started = false;
        this.captured = false;
      }
    }
  }

  onRotateMoveHandler(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      this.onRotateMove.emit(event);
    }
    catch (ex) {
      console.debug(`onRotateMoveHandler: Error occured - ${ex.message}`);
    }
  }

  onRotateEndHandler(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      this.onRotateEnd.emit(event);
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

  onRotateCancelHandler(event: HammerInput) {
    try {
      this.onRotateCancel.emit(event);
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
}

export interface RotateGestureRecognizerOptions {
  threshold?: number,
  pointers?: number,
  priority?: GesturePriority,
  disableScroll? : DisableScroll
}

@Injectable()
export class RotateGestureRecognizerProvider{
  constructor(private gestureController: GestureController) {
  }

  create(elementRef:ElementRef, options: RotateGestureRecognizerOptions) {
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.DuringCapture;

    let delegate = this.gestureController.create(`rotate-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new RotateGestureRecognizer(delegate, elementRef, options);
  }
}

let count = 0;


const DEFAULT_THRESHOLD: number = 0;
const DEFAULT_NUM_POINTERS = 2;

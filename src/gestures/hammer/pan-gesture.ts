import {ElementRef, EventEmitter, Injectable} from '@angular/core';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, BaseHammerGesture} from './base-gesture';
import {HammerFactory} from './hammer-factory';

export class PanGesture extends BaseHammerGesture {

  private onPanStartHandler: (event: HammerInput) => any;
  private onPanMoveHandler: (event: HammerInput) => any;
  private onPanEndHandler: (event: HammerInput) => any;
  private onPanCancelHandler: (event: HammerInput) => any;

  private _onPanStartHandlerInternal = (event: HammerInput) => {
    this.onPanStartHandlerInternal(event);
  }

  private _onPanMoveHandlerInternal = (event: HammerInput) => {
    this.onPanMoveHandlerInternal(event);
  }

  private _onPanEndHandlerInternal = (event: HammerInput) => {
    this.onPanEndHandlerInternal(event);
  }

  private _onPanCancelHandlerInternal = (event: HammerInput) => {
    this.onPanCancelHandlerInternal(event);
  }

  constructor(delegate: GestureDelegate, hammerFactory: HammerFactory, elementRef: ElementRef, options: PanGestureOptions) {
    super(delegate, hammerFactory, hammerFactory.createPanGestureRecognizer, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('panstart', this._onPanStartHandlerInternal);
    this.hammerManager.on('panmove', this._onPanMoveHandlerInternal);
    this.hammerManager.on('panend', this._onPanEndHandlerInternal);
    this.hammerManager.on('pancancel', this._onPanCancelHandlerInternal);
  }

  unlisten() {
    super.unlisten();
    this.hammerManager.off('panstart', this._onPanStartHandlerInternal);
    this.hammerManager.off('panmove', this._onPanMoveHandlerInternal);
    this.hammerManager.off('panend', this._onPanEndHandlerInternal);
    this.hammerManager.off('pancancel', this._onPanCancelHandlerInternal);
  }

  private onPanStartHandlerInternal(event: HammerInput) {
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

      if ( this.onPanStartHandler ) {
        this.onPanStartHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPanStartHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.started = false;
        this.captured = false;
      }
    }
  }

  private onPanMoveHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onPanMoveHandler ) {
        this.onPanMoveHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPanMoveHandler: Error occured - ${ex.message}`);
    }
  }

  private onPanEndHandlerInternal(event: HammerInput) {
    try {
      if ( ! this.started ) {
        throw new Error('Not started');
      }

      if ( ! this.captured ) {
        throw new Error('Not captured');
      }

      if ( this.onPanEndHandler ) {
        this.onPanEndHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPanEndHandler: Error occured - ${ex.message}`);
    }
    finally {
      if ( this.delegate ) {
        this.delegate.release();
      }
      this.started = false;
      this.captured = false;
    }
  }

  private onPanCancelHandlerInternal(event: HammerInput) {
    try {
      if ( this.onPanCancelHandler ) {
        this.onPanCancelHandler(event);
      }
    }
    catch (ex) {
      console.debug(`onPanCancelHandler: Error occured - ${ex.message}`);
    }
    finally {
      if ( this.delegate ) {
        this.delegate.release();
      }
      this.started = false;
      this.captured = false;
    }
  }

  onPanStart(handler: (event: HammerInput) => any) {
    this.onPanStartHandler = handler;
  }

  onPanMove(handler: (event: HammerInput) => any) {
    this.onPanMoveHandler = handler;
  }

  onPanEnd(handler: (event: HammerInput) => any) {
    this.onPanEndHandler = handler;
  }

  onPanCancel(handler: (event: HammerInput) => any) {
    this.onPanCancelHandler = handler;
  }
}

export interface PanGestureOptions {
  threshold?: number;
  pointers?: number;
  direction?: GestureDirection;
  priority?: GesturePriority;
  disableScroll?: DisableScroll;
}

@Injectable()
export class PanGestureController {
  constructor(private gestureController: GestureController, private hammerFactory: HammerFactory) {
  }

  create(elementRef: ElementRef, options: PanGestureOptions) {
    // assign reasonable defaults
    options.direction = !!options.direction ? options.direction : GestureDirection.ALL;
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = !!options.pointers ? options.pointers : 1;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.DuringCapture;

    let delegate = this.gestureController.create(`pan-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new PanGesture(delegate, this.hammerFactory, elementRef, options);
  }
}

let count = 0;
const DEFAULT_THRESHOLD: number = 1;
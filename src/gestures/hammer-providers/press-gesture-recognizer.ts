import {ElementRef, EventEmitter, Injectable} from '@angular/core';
import * as hammer from 'hammerjs';

import {DisableScroll, GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';
import {GestureDirection} from './gesture-direction';
import {CaptureError, GestureRecognizer} from './gesture-recognizer';

export class PressGestureRecognizer extends GestureRecognizer {

  public onPress = new EventEmitter<HammerInput>();
  public onPressUp = new EventEmitter<HammerInput>();

  private _onPressHandler = (event: HammerInput) => {
    this.onPressHandler(event);
  }

  private _onPressUpHandler = (event: HammerInput) => {
    this.onPressUpHandler(event);
  }

  constructor(delegate: GestureDelegate, elementRef: ElementRef, options: PressGestureRecognizerOptions) {
    super(delegate, hammer.Press, options, elementRef);
  }

  listen() {
    super.listen();
    this.hammerManager.on('press', this._onPressHandler);
    this.hammerManager.on('pressup', this._onPressUpHandler);
  }

  unlisten() {
    this.hammerManager.off('press', this._onPressHandler);
    this.hammerManager.off('pressup', this._onPressUpHandler);
    super.unlisten();
  }

  onPressHandler(event:HammerInput): void {
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

      this.onPress.emit(event);
    }
    catch(ex) {
      console.debug(`onPressHandler: Error occured - ${ex.message}`);
      if ( ex instanceof CaptureError ) {
        this.notCaptured(event);
      }
    }
  }

  onPressUpHandler(event: HammerInput) {
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

      this.onPressUp.emit(event);
    }
    catch(ex) {
      console.debug(`onPressUpHandler: Error occured - ${ex.message}`);
    }
    finally {
      this.delegate.release();
      this.started = false;
      this.captured = false;
    }
  }
}

export interface PressGestureRecognizerOptions {
  pointers?: number,
  threshold?: number,
  time?: number,
  priority?: GesturePriority,
  disableScroll? : DisableScroll
}

@Injectable()
export class PressGestureRecognizerProvider{
  constructor(private gestureController: GestureController) {
  }

  create(elementRef:ElementRef, options:PressGestureRecognizerOptions) {
    options.pointers = !!options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.threshold = !!options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.time = !!options.time ? options.time : DEFAULT_TIME;
    options.priority = !!options.priority ? options.priority : GesturePriority.Normal;
    options.disableScroll = !!options.disableScroll ? options.disableScroll : DisableScroll.Never;
    let delegate = this.gestureController.create(`press-gesture-#${++count}`, {
      priority: options.priority,
      disableScroll: options.disableScroll
    });

    return new PressGestureRecognizer(delegate, elementRef, options);
  }
}

let count = 0;

const DEFAULT_NUM_POINTERS: number = 1;
const DEFAULT_TIME : number = 251;
const DEFAULT_THRESHOLD : number = 9;

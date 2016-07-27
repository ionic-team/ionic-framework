import * as hammer from 'hammerjs';
import {ElementRef} from '@angular/core';
import {GestureController, GestureDelegate, GesturePriority} from '../gesture-controller';

import {merge} from '../../util/util';

const POINTER_DOWN_EVENT_TYPE = 1;
const POINTER_UP_EVENT_TYPE = 4;

export class GestureRecognizer {

    /* gesture logic helpers */
    protected recognizerEnabled: boolean;
    protected listening: boolean;
    protected started: boolean;
    protected captured: boolean;
    protected eventBlocker: boolean;

    /* hammer stuff */
    protected recognizer: Recognizer;
    protected hammerManager: HammerManager;

    private _inputEventHandler = (event: HammerInput) => {
      this.inputEventHandler(event);
    };

    constructor(protected delegate: GestureDelegate, recognizer: RecognizerStatic, opts: any, protected element: ElementRef) {
      this.recognizer = new recognizer(this.getMergedOptions(opts));
    }

    getMergedOptions(opts: any = {}): any{
      let additionalOptions = {
        enable: () => {
          return this.recognizerEnabled
        }
      };
      return merge(additionalOptions, opts);
    }

    listen() {
      this.recognizerEnabled = false;
      if (! this.listening ) {
        this.hammerManager = new hammer.Manager(this.element.nativeElement);
        this.hammerManager.on('hammer.input', this._inputEventHandler);
        this.hammerManager.add(this.recognizer);
      }
      this.listening = true;
    }

    unlisten() {
      this.delegate && this.delegate.release();
      this.hammerManager.off('hammer.input', this._inputEventHandler);
      this.listening = false;
    }

    destroy() {
      this.delegate && this.delegate.destroy();
      this.hammerManager.remove(this.recognizer);
      this.recognizer = null;
      this.hammerManager = null;
      this.element = null;
    }

    inputEventHandler(event: HammerInput) {
      if ( ! this.eventBlocker ) {
        // hack to make up for buggy definition file
        let eventType = <number> <any> event.eventType;
        // we only care about start AND (end or cancel) events
        if ( eventType === hammer.INPUT_START ) {
          this.pointerDown(event);
        } else if ( eventType === hammer.INPUT_END || eventType === hammer.INPUT_CANCEL ) {
          // okay, bear with me here for a second
          // Some gestures require touch up before being recognized - for example Swipe!
          // so, our pointerUp logic needs to execute *after* the gesture had a chance to recognized
          // So, we need to let hammer do it's thing and try to recongize, then run our code
          // So just defer execution of our code until the next event loop
          this.eventBlocker = true;
          setTimeout( () => {
            this.eventBlocker = false;
            this.pointerUp(event);
          }, 1);
        }
      }
    }

    pointerDown(event: HammerInput) {
      try {
        if ( this.started ) {
          throw new Error('Already started');
        }

        if ( ! this.canStart(event) ) {
          throw new Error('Cannot start');
        }

        if ( ! this.delegate ) {
          throw new Error('Missing delegate');
        }

        // we are enabling the gesture recognizer,
        // but we haven't started recongizing
        // or captured a gesture yet
        this.recognizerEnabled = true;
        this.started = false;
        this.captured = false;
      }
      catch (ex) {
        console.log(`Gesture Recognizer: Error occured during pointerdown - ${ex.message}`);
      }
    }

    pointerUp(event: HammerInput) {
      try {
        if ( ! this.delegate ) {
          throw new Error("Missing delegate");
        }

        this.delegate.release();

        if ( ! this.captured ){
          this.notCaptured(event);
        }

        this.recognizerEnabled = false;
        this.started = false;
        this.captured = false;
      }
      catch (ex) {
        console.log(`Gesture Recognizer: Error occured during pointerup - ${ex.message}`);
      }
    }

    requireFailure(gestureRecognizer: GestureRecognizer ) {
      this.recognizer.requireFailure(gestureRecognizer.getRecognizer());
    }

    dropRequireFailure(gestureRecognizer: GestureRecognizer ) {
      this.recognizer.dropRequireFailure(gestureRecognizer.getRecognizer());
    }

    recognizeWith(gestureRecognizer: GestureRecognizer ) {
      this.recognizer.requireFailure(gestureRecognizer.getRecognizer());
    }

    dropRecognizeWith(gestureRecognizer: GestureRecognizer ) {
      this.recognizer.dropRequireFailure(gestureRecognizer.getRecognizer());
    }

    getRecognizer() {
      return this.recognizer;
    }

    /* default implementation, implemenet if needed */
    canStart(event: HammerInput): boolean { return true; }
    pointerMove(event: HammerInput) {};
    notCaptured(event: HammerInput) { }
}

export class CaptureError extends Error {
  constructor(msg: string ){
    super(msg);
  }
}

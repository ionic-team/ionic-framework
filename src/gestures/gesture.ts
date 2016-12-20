import { defaults, assign } from '../util/util';
import { Hammer, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from './hammer';

// TODO(mlynch): Re-enable the DOM event simulation that was causing issues (or verify hammer does this already, it might);

/**
 * @name Gesture
 * @description
 * Ionic supports a variety of touch events and gestures. Basic gestures can 
 * be accessed from HTML by binding to `tap`, `press`, `pan`, `swipe`, `rotate`, 
 * and `pinch` events.
 * 
 * @usage
 * ```html
 * <ion-card (tap)="tapEvent($event)">
 *   <ion-item>
 *     Tapped: {{tap}} times
 *   </ion-item>
 * </ion-card>
 * ```
 * 
 * ### Using Rotate and Pinch
 * 
 * The `rotate` and `pinch` gestures are disabled by default because they are blocking. To enable, import and create an instance of `Gesture`, then assign an event listener to the desired DOM element.
 * 
 * ```ts
 * import { Gesture } from 'ionic-angular';
 * 
 * ...
 * 
 * export class HomePage {
 * 
 *   //get elementRef for DOM element we want to assign to
 *   @ViewChild('myTouchElement') element;
 *   gesture: Gesture
 * 
 * ...
 * 
 *   ionViewDidLoad() {
 *     //create gesture obj w/ ref to DOM element
 *     this.gesture = new Gesture(this.element.nativeElement);    
 *     
 *     //listen for the gesture
 *     this.gesture.listen();
 *     
 *     //turn on listening for pinch or rotate events
 *     this.gesture.on('pinch', e => console.log(e));
 *     
 *     //add event listener
 *     this.gesture.on('pinch', () => console.log('pinch end event'));
 *   }
 *   
 * }
 * ```
 * 
 * Event listeners can be added for any event supported by hammer.js, e.g. `pinchstart`, `pinchend`, `rotatestart`, `rotateend`, etc. For a full list, see the [hammer.js recognizers docs](http://hammerjs.github.io/recognizer-pinch/). 
 */

export class Gesture {
  private _hammer: any;
  private _options: any;
  private _callbacks: any = {};

  public element: HTMLElement;
  public direction: string;
  public isListening: boolean = false;

  constructor(element: HTMLElement, opts: any = {}) {
    defaults(opts, {
      domEvents: true
    });
    this.element = element;

    // Map 'x' or 'y' string to hammerjs opts
    this.direction = opts.direction || 'x';
    opts.direction = this.direction === 'x' ?
      DIRECTION_HORIZONTAL :
      DIRECTION_VERTICAL;

    this._options = opts;
  }

  options(opts: any) {
    assign(this._options, opts);
  }

  on(type: string, cb: Function) {
    if (type === 'pinch' || type === 'rotate') {
      this._hammer.get(type).set({enable: true});
    }
    this._hammer.on(type, cb);
    (this._callbacks[type] || (this._callbacks[type] = [])).push(cb);
  }

  off(type: string, cb: Function) {
    this._hammer.off(type, this._callbacks[type] ? cb : null);
  }

  listen() {
    if (!this.isListening) {
      this._hammer = Hammer(this.element, this._options);
    }
    this.isListening = true;
  }

  unlisten() {
    let eventType: string;
    let i: number;

    if (this._hammer && this.isListening) {
      for (eventType in this._callbacks) {
        for (i = 0; i < this._callbacks[eventType].length; i++) {
          this._hammer.off(eventType, this._callbacks[eventType]);
        }
      }
      this._hammer.destroy();
    }
    this._callbacks = {};
    this._hammer = null;
    this.isListening = false;
  }

  destroy() {
    this.unlisten();
    this.element = this._options = null;
  }
}

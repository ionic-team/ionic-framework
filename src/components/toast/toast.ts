import {AfterViewInit, Component, ElementRef, EventEmitter, Output, Renderer} from '@angular/core';

import {ActionSheet, ActionSheetOptions} from '../action-sheet/action-sheet';
import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';

import {Config} from '../../config/config';
import {isPresent} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {NavController} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';

/**
 * @name Toast
 * @description
 * A Toast is a subtle notification commonly used in modern applications.
 * It can be used to provide feedback about an operation or to
 * display a system message. The toast appears on top of the app's content,
 * and can be dismissed by the app to resume user interaction with
 * the app.
 *
 * ### Creating
 * All of the toast options should be passed in the first argument of
 * the create method: `Toast.create(opts)`. The message to display should be
 * passed in the `message` property. The `showCloseButton` option can be set to
 * true in order to display a close button on the toast. See the [create](#create)
 * method below for all available options.
 *
 * ### Positioning
 * Toasts can be positioned at the top, bottom or middle of the
 * view port. The position can be passed to the `Toast.create(opts)` method.
 * The position option is a string, and the values accepted are `top`, `bottom` and `middle`.
 * If the position is not specified, the toast will be displayed at the bottom of the view port.
 *
 * ### Dismissing
 * The toast can be dismissed automatically after a specific amount of time
 * by passing the number of milliseconds to display it in the `duration` of
 * the toast options. If `showCloseButton` is set to true, then the close button
 * will dismiss the toast. To dismiss the toast after creation, call the `dismiss()`
 * method on the Toast instance. The `onDismiss` function can be called to perform an action after the toast
 * is dismissed.
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentToast() {
 *   let toast = Toast.create({
 *     message: 'User was added successfully',
 *     duration: 3000,
 *     position: 'top'
 *   });
 *
 *   toast.onDismiss(() => {
 *     console.log('Dismissed toast');
 *   });
 *
 *   this.nav.present(toast);
 * }
 * ```
 *
 * @demo /docs/v2/demos/toast/
 */
export class Toast extends ViewController {

  constructor(opts: ToastOptions = {}) {
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
    super(ToastCmp, opts);

    // set the position to the bottom if not provided
    if (! opts.position || ! this.isValidPosition(opts.position)) {
      opts.position = TOAST_POSITION_BOTTOM;
    }

    this.viewType = 'toast';
    this.isOverlay = true;
    this.usePortal = true;

    // by default, toasts should not fire lifecycle events of other views
    // for example, when an toast enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
  }


  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = 'toast' + (direction === 'back' ? 'Leave' : 'Enter');
    return this._nav && this._nav.config.get(key);
  }

  /**
  * @private
  */
  isValidPosition(position: string) {
    return position === TOAST_POSITION_TOP || position === TOAST_POSITION_MIDDLE || position === TOAST_POSITION_BOTTOM;
  }

  /**
   * @param {string} message  Toast message content
   */
  setMessage(message: string) {
    this.data.message = message;
  }

  /**
   *
   *  Toast options
   *
   *  | Property              | Type      | Default         | Description                                                                                                   |
   *  |-----------------------|-----------|-----------------|---------------------------------------------------------------------------------------------------------------|
   *  | message               | `string`  | -               | The message for the toast. Long strings will wrap and the toast container will expand.                        |
   *  | duration              | `number`  | -               | How many milliseconds to wait before hiding the toast. By default, it will show until `dismiss()` is called.  |
   *  | position              | `string`  | "bottom"        | The position of the toast on the screen. Accepted values: "top", "middle", "bottom".                          |
   *  | cssClass              | `string`  | -               | Any additional class for custom styles.                                                                       |
   *  | showCloseButton       | `boolean` | false           | Whether or not to show a button to close the toast.                                                           |
   *  | closeButtonText       | `string`  | "Close"         | Text to display in the close button.                                                                          |
   *  | dismissOnPageChange   | `boolean` | false           | Whether to dismiss the toast when navigating to a new page.                                                   |
   *
   * @param {object} opts Toast options. See the above table for available options.
   */
  static create(opts: ToastOptions = {}) {
    return new Toast(opts);
  }
}

/* Don't expose these for now - let's move to an enum or something long term */
const TOAST_POSITION_TOP: string = 'top';
const TOAST_POSITION_MIDDLE: string = 'middle';
const TOAST_POSITION_BOTTOM: string = 'bottom';

/**
* @private
*/
@Component({
  selector: 'ion-toast',
  template: `
    <div class="toast-wrapper"
      [class.toast-bottom]="d.position === 'bottom'"
      [class.toast-middle]="d.position === 'middle'"
      [class.toast-top]="d.position === 'top'"
      >
      <div class="toast-container">
        <div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div>
        <button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()">
          {{ d.closeButtonText || 'Close' }}
         </button>
      </div>
    </div>
  `,
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId',
  },
})
class ToastCmp implements AfterViewInit {
  private d: any;
  private descId: string;
  private dismissTimeout: number = undefined;
  private enabled: boolean;
  private hdrId: string;
  private id: number;

  constructor(
    private _nav: NavController,
    private _viewCtrl: ViewController,
    private _config: Config,
    private _elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
 ) {

    this.d = params.data;

    if (this.d.cssClass) {
      renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
    }

    this.id = (++toastIds);
    if (this.d.message) {
      this.hdrId = 'toast-hdr-' + this.id;
    }
  }

  ngAfterViewInit() {
    // if there's a `duration` set, automatically dismiss.
    if (this.d.duration) {
      this.dismissTimeout =
        setTimeout(() => {
          this.dismiss('backdrop');
        }, this.d.duration);
    }
    this.enabled = true;
  }

  ionViewDidEnter() {
    const { activeElement }: any = document;
    if (activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('button');

    if (focusableEle) {
      focusableEle.focus();
    }
  }

  cbClick() {
    if (this.enabled) {
      this.dismiss('close');
    }
  }

  dismiss(role: any): Promise<any> {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = undefined;
    return this._viewCtrl.dismiss(null, role);
  }

}

export interface ToastOptions {
  message?: string;
  cssClass?: string;
  duration?: number;
  showCloseButton?: boolean;
  closeButtonText?: string;
  dismissOnPageChange?: boolean;
  position?: string;
}

class ToastSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // DOM READS
    let ele = enteringView.pageRef().nativeElement;
    const wrapperEle = <HTMLElement> ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(wrapperEle);

    if (enteringView.data && enteringView.data.position === TOAST_POSITION_TOP) {
      // top
      // by default, it is -100% hidden (above the screen)
      // so move from that to 10px below top: 0px;
      wrapper.fromTo('translateY', '-100%', `${10}px`);

    } else if (enteringView.data && enteringView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just center it and fade it in
      let topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
      // DOM WRITE
      wrapperEle.style.top = `${topPosition}px`;
      wrapper.fromTo('opacity', 0.01, 1);

    } else {
      // bottom
      // by default, it is 100% hidden (below the screen),
      // so move from that to 10 px above bottom: 0px
      wrapper.fromTo('translateY', '100%', `${0 - 10}px`);
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
  }
}

class ToastSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    let ele = leavingView.pageRef().nativeElement;
    const wrapperEle = <HTMLElement> ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(wrapperEle);

    if (leavingView.data && leavingView.data.position === TOAST_POSITION_TOP) {
      // top
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${10}px`, '-100%');

    } else if (leavingView.data && leavingView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just fade it out
      wrapper.fromTo('opacity', 0.99, 0);

    } else {
      // bottom
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${0 - 10}px`, '100%');
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(wrapper);
  }
}

class ToastMdSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // DOM reads
    let ele = enteringView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(wrapperEle);

    if (enteringView.data && enteringView.data.position === TOAST_POSITION_TOP) {
      // top
      // by default, it is -100% hidden (above the screen)
      // so move from that to top: 0px;
      wrapper.fromTo('translateY', '-100%', `0%`);

    } else if (enteringView.data && enteringView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just center it and fade it in
      let topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
      // DOM WRITE
      wrapperEle.style.top = `${topPosition}px`;
      wrapper.fromTo('opacity', 0.01, 1);

    } else {
      // bottom
      // by default, it is 100% hidden (below the screen),
      // so move from that to bottom: 0px
      wrapper.fromTo('translateY', '100%', `0%`);
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
  }
}

class ToastMdSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    let ele = leavingView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(wrapperEle);

    if (leavingView.data && leavingView.data.position === TOAST_POSITION_TOP) {
      // top
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${0}%`, '-100%');

    } else if (leavingView.data && leavingView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just fade it out
      wrapper.fromTo('opacity', 0.99, 0);

    } else {
      // bottom
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${0}%`, '100%');
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(wrapper);
  }
}

class ToastWpPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    let ele = enteringView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(wrapperEle);

    if (enteringView.data && enteringView.data.position === TOAST_POSITION_TOP) {
      // top
      wrapper.fromTo('opacity', 0.01, 1);
      wrapper.fromTo('scale', 1.3, 1);

    } else if (enteringView.data && enteringView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just center it and fade it in
      let topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);

      // DOM WRITE
      wrapperEle.style.top = `${topPosition}px`;
      wrapper.fromTo('opacity', 0.01, 1);
      wrapper.fromTo('scale', 1.3, 1);

    } else {
      // bottom
      wrapper.fromTo('opacity', 0.01, 1);
      wrapper.fromTo('scale', 1.3, 1);
    }

    this.easing('cubic-bezier(0,0 0.05,1)').duration(200).add(wrapper);
  }
}

class ToastWpPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // DOM reads
    let ele = leavingView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(wrapperEle);

    if (leavingView.data && leavingView.data.position === TOAST_POSITION_TOP) {
      // top
      // reverse arguments from enter transition
      wrapper.fromTo('opacity', 0.99, 0);
      wrapper.fromTo('scale', 1, 1.3);

    } else if (leavingView.data && leavingView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just fade it out
      wrapper.fromTo('opacity', 0.99, 0);
      wrapper.fromTo('scale', 1, 1.3);

    } else {
      // bottom
      // reverse arguments from enter transition
      wrapper.fromTo('opacity', 0.99, 0);
      wrapper.fromTo('scale', 1, 1.3);
    }

    // DOM writes
    const EASE: string = 'ease-out';
    const DURATION: number = 150;
    this.easing(EASE).duration(DURATION).add(wrapper);
  }
}


Transition.register('toast-slide-in', ToastSlideIn);
Transition.register('toast-slide-out', ToastSlideOut);
Transition.register('toast-md-slide-in', ToastMdSlideIn);
Transition.register('toast-md-slide-out', ToastMdSlideOut);
Transition.register('toast-wp-slide-out', ToastWpPopOut);
Transition.register('toast-wp-slide-in', ToastWpPopIn);

let toastIds = -1;

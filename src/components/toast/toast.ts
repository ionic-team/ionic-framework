import {Component, ElementRef, Renderer, Output, EventEmitter} from '@angular/core';

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
 * A Toast is a subtle notification that appears at the bottom of the
 * screen. It can be used to provide feedback about an operation or to
 * display a system message. The toast appears on top of the app's content,
 * and can be dismissed by the app to resume user interaction with
 * the app. It includes a backdrop, which can optionally be clicked to
 * dismiss the toast.
 *
 * ### Creating
 * All of the toast options should be passed in the first argument of
 * the create method: `Toast.create(opts)`. The message to display should be
 * passed in the `message` property. The `showCloseButton` option can be set to
 * true in order to display a close button on the toast. See the [create](#create)
 * method below for all available options.
 *
 * ### Dismissing
 * The toast can be dismissed automatically after a specific amount of time
 * by passing the number of milliseconds to display it in the `duration` of
 * the toast options. It can also be dismissed by clicking on the backdrop,
 * unless `enableBackdropDismiss` is set to `false` upon creation. If `showCloseButton`
 * is set to true, then the close button will dismiss the toast. To dismiss
 * the toast after creation, call the `dismiss()` method on the Toast instance.
 * The `onDismiss` function can be called to perform an action after the toast
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
 *     duration: 3000
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


/**
* @private
*/
@Component({
  selector: 'ion-toast',
  template: `
    <div class="toast-wrapper">
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
class ToastCmp {
  private d: any;
  private descId: string;
  private hdrId: string;
  private created: number;
  private id: number;
  private dismissTimeout: number = undefined;

  constructor(
    private _nav: NavController,
    private _viewCtrl: ViewController,
    private _config: Config,
    private _elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
  ) {

    this.d = params.data;
    this.created = Date.now();

    if (this.d.cssClass) {
      renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
    }

    this.id = (++toastIds);
    if (this.d.message) {
      this.hdrId = 'toast-hdr-' + this.id;
    }
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

    // if there's a `duration` set, automatically dismiss.
    if (this.d.duration) {
      this.dismissTimeout =
        setTimeout(() => {
          this.dismiss('backdrop');
        }, this.d.duration);
    }
  }

  cbClick() {
    if (this.isEnabled()) {
      this.dismiss('close');
    }
  }

  dismiss(role: any): Promise<any> {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = undefined;
    return this._viewCtrl.dismiss(null, role);
  }

  isEnabled() {
    let tm = this._config.getNumber('overlayCreatedDiff', 750);
    return (this.created + tm < Date.now());
  }

}

export interface ToastOptions {
  message?: string;
  cssClass?: string;
  duration?: number;
  showCloseButton?: boolean;
  closeButtonText?: string;
  dismissOnPageChange?: boolean;
}

class ToastSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    wrapper.fromTo('translateY', '120%', '0%');
    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
  }
}

class ToastSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    wrapper.fromTo('translateY', '0%', '120%');
    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(wrapper);
  }
}

class ToastMdSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    backdrop.fromTo('opacity', 0, 0);
    wrapper.fromTo('translateY', '120%', '0%');
    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
  }
}

class ToastMdSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));
    let backdrop = new Animation(ele.querySelector('.backdrop'));

    wrapper.fromTo('translateY', '0%', '120%');
    backdrop.fromTo('opacity', 0, 0);
    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
  }
}

class ToastWpPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
    backdrop.fromTo('opacity', 0, 0);

    this.easing('cubic-bezier(0,0 0.05,1)').duration(200).add(backdrop).add(wrapper);
  }
}

class ToastWpPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
    backdrop.fromTo('opacity', 0, 0);

    this.easing('ease-out').duration(150).add(backdrop).add(wrapper);
  }
}


Transition.register('toast-slide-in', ToastSlideIn);
Transition.register('toast-slide-out', ToastSlideOut);
Transition.register('toast-md-slide-in', ToastMdSlideIn);
Transition.register('toast-md-slide-out', ToastMdSlideOut);
Transition.register('toast-wp-slide-out', ToastWpPopOut);
Transition.register('toast-wp-slide-in', ToastWpPopIn);

let toastIds = -1;

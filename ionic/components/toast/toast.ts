import {Component, ElementRef, Renderer, Output, EventEmitter} from 'angular2/core';
import {NgClass, NgIf, NgFor} from 'angular2/common';

import {Button} from '../button/button';
import {Icon} from '../icon/icon';
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
 * An Toast is a small message that appears in the lower part of the screen.
 * It's useful for displaying success messages, error messages, etc.
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
 *   this.nav.present(toast);
 * }
 * ```
 *
 * @demo /docs/v2/demos/toast/
 */
export class Toast extends ViewController {

  constructor(opts: ToastOptions = {}) {
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
    super(ToastCmp, opts);


    this.viewType = 'toast';
    this.isOverlay = false;

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
   *  | Property              | Type      | Description                                                                   |
   *  |-----------------------|-----------|---------------------------------------------------------------------------    |
   *  | message               | `string`  | The message for the toast. Long strings will wrap and the toast container will expand. **(required)**                                                     |
   *  | duration              | `number`  | The amount of time in milliseconds the toast should appear *(optional)*         |
   *  | cssClass              | `string`  | Any additional class for the toast *(optional)*                                 |
   *  | showCloseButton       | `boolean` | Whether or not to show an optional button to close the toast. *(optional)*      |
   *  | closeButtonText       | `string`  | Text to display in the close button. *(optional)*                               |
   *  | enableBackdropDismiss | `boolean` | Whether the the toast should be dismissed by tapping the backdrop *(optional)*  |
   *
   * @param {object} ToastOptions Toast. See the above table for available options.
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
    <div (click)="bdClick()" tappable disable-activated class="backdrop" role="presentation"></div>
    <div class="toast-wrapper">
      <div class="toast-container">
        <div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div>
        <button clear class="toast-button" *ngIf="d.showCloseButton" (click)="bdClick()">
          {{ d.closeButtonText }}
          <ion-button-effect></ion-button-effect>
         </button>
      </div>
    </div>
  `,
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId'
  },
  directives: [NgIf, Icon, Button]
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

  onPageDidEnter() {
    const { activeElement }: any = document;
    if (activeElement) {
      activeElement.blur();
    }

    let focusableEle = this._elementRef.nativeElement.querySelector('button');

    if (focusableEle) {
      focusableEle.focus();
    }

    // if there's a `duration` set, automatically dismiss.
    this.dismissTimeout = setTimeout(() => this.dismiss('backdrop'), this.d.duration ? this.d.duration : 3000)
  }

  click(button, dismissDelay?) {
    if (!this.isEnabled()) {
      return;
    }
    let shouldDismiss = true;

    if (shouldDismiss) {
      setTimeout(() => {
        this.dismiss(button.role);
      }, dismissDelay || this._config.get('pageTransitionDelay'));
    }
  }

  bdClick() {
    if (this.isEnabled() && this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  dismiss(role): Promise<any> {
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
  title?: string;
  cssClass?: string;
  buttons?: Array<any>;
  duration?: number,
  showCloseButton?: boolean;
  closeButtonText?: string;
  enableBackdropDismiss?: boolean;
}

class ToastSlideIn extends Transition {
  constructor(enteringView, leavingView, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    wrapper.fromTo('translateY', '100%', '0%');
    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
  }
}

class ToastSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));

    wrapper.fromTo('translateY', '0%', '100%');
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
    wrapper.fromTo('translateY', '100%', '0%');
    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper)
  }
}

class ToastMdSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.toast-wrapper'));
    let backdrop = new Animation(ele.querySelector('.backdrop'));

    wrapper.fromTo('translateY', '0%', '100%');
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

import { AfterViewInit, Component, ElementRef, Renderer } from '@angular/core';
import { NgIf } from '@angular/common';

import { Animation } from '../../animations/animation';
import { Config } from '../../config/config';
import { isPresent } from '../../util/util';
import { NavParams } from '../nav/nav-params';
import { Transition, TransitionOptions } from '../../transitions/transition';
import { ViewController } from '../nav/view-controller';


/**
* @private
*/
@Component({
  selector: 'ion-toast',
  template: `
    <div class="toast-wrapper"
      [class.toast-bottom]="d.position === 'bottom'"
      [class.toast-middle]="d.position === 'middle'"
      [class.toast-top]="d.position === 'top'">
      <div class="toast-container">
        <div class="toast-message" id="{{hdrId}}" *ngIf="d.message">{{d.message}}</div>
        <button clear class="toast-button" *ngIf="d.showCloseButton" (click)="cbClick()">
          {{ d.closeButtonText || 'Close' }}
         </button>
      </div>
    </div>
  `,
  directives: [NgIf],
  host: {
    'role': 'dialog',
    '[attr.aria-labelledby]': 'hdrId',
    '[attr.aria-describedby]': 'descId',
  },
})
export class ToastCmp implements AfterViewInit {
  private d: any;
  private descId: string;
  private dismissTimeout: number = undefined;
  private enabled: boolean;
  private hdrId: string;
  private id: number;

  constructor(
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
const TOAST_POSITION_TOP = 'top';
const TOAST_POSITION_MIDDLE = 'middle';
const TOAST_POSITION_BOTTOM = 'bottom';

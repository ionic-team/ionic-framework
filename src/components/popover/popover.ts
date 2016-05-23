import {Component, Renderer, ElementRef, HostListener, ViewEncapsulation} from '@angular/core';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {NavParams} from '../nav/nav-params';
import {isPresent, isUndefined, isDefined} from '../../util/util';
import {ViewController} from '../nav/view-controller';

const POPOVER_BODY_PADDING = 6;

/**
 * @name Popover
 * @description
 *
 */
export class Popover extends ViewController {

  constructor(opts: PopoverOptions = {}) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(PopoverCmp, opts);
    this.viewType = 'popover';
    this.isOverlay = true;
    this.usePortal = false;

    // by default, popovers should not fire lifecycle events of other views
    // for example, when a popover enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
  }

   /**
   * @private
   */
   getTransitionName(direction: string) {
     let key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
     return this._nav && this._nav.config.get(key);
   }

   /**
    * Create a popover with the following options
    *
    * | Option                | Type       | Description                                                                                                      |
    * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
    * | template              |`string`    | The html content for the popover.                                                                                |
    * | cssClass              |`string`    | An additional class for custom styles.                                                                           |
    * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
    * | enableBackdropDismiss |`boolean`   | Wheather the popover should be dismissed by tapping the backdrop. Default true.                                  |
    *
    *
    * @param {object} opts Popover options
    */
   static create(opts: PopoverOptions = {}) {
     return new Popover(opts);
   }

 }

/**
* @private
*/
@Component({
  selector: 'ion-popover',
  template:
    '<div disable-activated class="backdrop" (click)="bdClick()" [class.hide-backdrop]="!d.showBackdrop" role="presentation"></div>' +
    '<div class="popover-arrow"></div>' +
    '<div class="popover-wrapper">' +
      '<div *ngIf="d.template" [innerHTML]="d.template" class="popover-template"></div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  encapsulation: ViewEncapsulation.None,
})
class PopoverCmp {
  private d: any;
  private id: number;
  private created: number;
  private showSpinner: boolean;

  constructor(
    private _viewCtrl: ViewController,
    private _config: Config,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    params: NavParams
  ) {
    this.d = params.data;
    this.created = Date.now();

    if (this.d.cssClass) {
      _renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
    }

    this.id = (++popoverIds);
  }

  ngOnInit() {
    if (this.d.element && this.d.event) {
      this.positionView(this.d.element, this.d.event);
    }
  }

  onPageDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }
  }

  positionView(targetEle, ev) {
    let popoverEle = this._elementRef.nativeElement;
    let popoverWrapperEle = popoverEle.querySelector('.popover-wrapper');

    // Popover width and height
    let popoverWidth = popoverWrapperEle.offsetWidth;
    let popoverHeight = popoverWrapperEle.offsetHeight;

    // Window body width and height
    let bodyWidth = window.innerWidth;
    let bodyHeight = window.innerHeight;

    // Clicked element width and height
    targetEle = targetEle._elementRef.nativeElement;
    let targetWidth = targetEle.offsetWidth;
    let targetHeight = targetEle.offsetHeight;

    // console.log("Popover Wrapper Element", popoverWrapperEle);
    // console.log("Popover Wrapper Width & Height", popoverWidth, popoverHeight);
    // console.log("Body Width & Height", bodyWidth, bodyHeight);
    // console.log("Target", targetEle);
    // console.log("Target Width & Height", targetWidth, targetHeight);

    let popoverCSS = {
      top: ev.clientY + targetHeight - (popoverHeight / 2),
      left: ev.clientX - popoverWidth / 2
    };

    // The arrow that shows above the popover on iOS
    var arrowEle = popoverEle.querySelector('.popover-arrow');
    var arrowWidth = arrowEle.offsetWidth;
    var arrowHeight = arrowEle.offsetHeight;

    let arrowLeft = targetWidth + targetWidth / 2 -
      arrowEle.offsetWidth / 2 - popoverCSS.left;

    let arrowCSS = {
      top: ev.clientY + targetHeight - (popoverHeight / 2) - arrowHeight,
      left: ev.clientX - (arrowWidth / 2)
    }

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < POPOVER_BODY_PADDING) {
      popoverCSS.left = POPOVER_BODY_PADDING;
      arrowCSS.left = (POPOVER_BODY_PADDING * 2);
    } else if (popoverWidth + POPOVER_BODY_PADDING + popoverCSS.left > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
      arrowCSS.left = bodyWidth - (POPOVER_BODY_PADDING * 2) - arrowWidth;
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (popoverCSS.top + POPOVER_BODY_PADDING + popoverHeight > bodyHeight &&
        popoverCSS.top - popoverHeight > 0) {
        popoverCSS.top = popoverCSS.top - targetHeight - popoverHeight;
        this._renderer.setElementClass(this._elementRef.nativeElement, 'popover-bottom', true);
    }

    this._renderer.setElementStyle(arrowEle, 'top', arrowCSS.top + 'px');
    this._renderer.setElementStyle(arrowEle, 'left', arrowCSS.left + 'px');

    this._renderer.setElementStyle(popoverWrapperEle, 'top', popoverCSS.top + 'px');
    this._renderer.setElementStyle(popoverWrapperEle, 'left', popoverCSS.left + 'px');
  }

  dismiss(role): Promise<any> {
    return this._viewCtrl.dismiss(null, role);
  }

  bdClick() {
    if (this.isEnabled() && this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  isEnabled() {
    let tm = this._config.getNumber('overlayCreatedDiff', 750);
    return (this.created + tm < Date.now());
  }
}

export interface PopoverOptions {
  template?: string;
  element?: any;
  event?: any;
  cssClass?: string;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
}

/**
 * Animations for popover
 */
class PopoverPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.3');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-pop-in', PopoverPopIn);


class PopoverPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.3', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-pop-out', PopoverPopOut);


class PopoverMdPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-md-pop-in', PopoverMdPopIn);


class PopoverMdPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-md-pop-out', PopoverMdPopOut);



class PopoverWpPopIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('cubic-bezier(0,0 0.05,1)')
      .duration(200)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-wp-pop-in', PopoverWpPopIn);


class PopoverWpPopOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-out')
      .duration(150)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-wp-pop-out', PopoverWpPopOut);

let popoverIds = -1;

import {Component, ViewChild, ViewContainerRef, DynamicComponentLoader} from '@angular/core';
import {Renderer, ElementRef} from '@angular/core';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {NavParams} from '../nav/nav-params';
import {Platform} from '../../platform/platform';
import {isPresent, isUndefined, isDefined} from '../../util/util';
import {ViewController} from '../nav/view-controller';

const POPOVER_BODY_PADDING = 2;

/**
 * @name Popover
 * @description
 *
 */
export class Popover extends ViewController {

  constructor(componentType, data: any = {}, opts: PopoverOptions = {}) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    data.componentType = componentType;
    data.opts = opts;
    super(PopoverCmp, data);
    this.viewType = 'popover';
    this.isOverlay = true;

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
    * | cssClass              |`string`    | An additional class for custom styles.                                                                           |
    * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
    * | enableBackdropDismiss |`boolean`   | Wheather the popover should be dismissed by tapping the backdrop. Default true.                                  |
    *
    *
    * @param {object} data Any data to pass to the popover view
    * @param {object} opts Popover options
    */
   static create(componentType, data = {}, opts: PopoverOptions = {}) {
     return new Popover(componentType, data, opts);
   }

 }

/**
* @private
*/
@Component({
  selector: 'ion-popover',
  template:
    '<div disable-activated class="backdrop" (click)="bdClick()" [class.hide-backdrop]="!d.showBackdrop"></div>' +
    '<div class="popover-arrow"></div>' +
    '<div class="popover-wrapper">' +
      '<div #viewport></div>' +
    '</div>'
})
class PopoverCmp {
  @ViewChild('viewport', {read: ViewContainerRef}) viewport: ViewContainerRef;

  private d: any;
  private id: number;
  private created: number;
  private showSpinner: boolean;

  constructor(private _loader: DynamicComponentLoader,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    private _config: Config,
    private _navParams: NavParams,
    private _viewCtrl: ViewController
  ) {
    this.d = _navParams.data.opts;
    this.created = Date.now();

    if (this.d.cssClass) {
      _renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
    }

    this.id = (++popoverIds);
  }

  onPageWillEnter() {
    this._loader.loadNextToLocation(this._navParams.data.componentType, this.viewport).then(componentRef => {
      this._viewCtrl.setInstance(componentRef.instance);

      // manually fire onPageWillEnter() since ModalCmp's  onPageWillEnter already happened
      this._viewCtrl.willEnter();
    });
  }

  onPageDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }
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
  cssClass?: string;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
}

/**
 * Animations for popover
 */
class PopoverTransition extends Transition {
  constructor(opts: TransitionOptions) {
    super(opts);
  }

  positionView(nativeEle: HTMLElement, ev) {
    // Popover wrapper width and height
    let popoverEle = <HTMLElement>nativeEle.querySelector('.popover-wrapper');
    let popoverDim = popoverEle.getBoundingClientRect();
    let popoverWidth = popoverDim.width;
    let popoverHeight = popoverDim.height;

    // Window body width and height
    // let bodyWidth = this._platform.width();
    // let bodyHeight = this._platform.height();
    let bodyWidth = window.innerWidth;
    let bodyHeight = window.innerHeight;

    // Target element width and height
    let targetDim = ev.target.getBoundingClientRect();
    let targetTop = targetDim.top;
    let targetLeft = targetDim.left;
    let targetWidth = targetDim.width;
    let targetHeight = targetDim.height;

    // The arrow that shows above the popover on iOS
    var arrowEle = <HTMLElement>nativeEle.querySelector('.popover-arrow');
    let arrowDim = arrowEle.getBoundingClientRect();
    var arrowWidth = arrowDim.width;
    var arrowHeight = arrowDim.height;

    let arrowCSS = {
      top: targetTop + targetHeight,
      left: targetLeft + (targetWidth / 2) - (arrowWidth / 2)
    };

    let popoverCSS = {
      top: targetTop + targetHeight + (arrowHeight - 1),
      left: targetLeft + (targetWidth / 2) - (popoverWidth / 2)
    };

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < POPOVER_BODY_PADDING) {
      popoverCSS.left = POPOVER_BODY_PADDING;
    } else if (popoverWidth + POPOVER_BODY_PADDING + popoverCSS.left > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_BODY_PADDING;
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (popoverCSS.top + POPOVER_BODY_PADDING + popoverHeight > bodyHeight && popoverCSS.top - popoverHeight > 0) {
      arrowCSS.top = targetTop - (arrowHeight + 1);
      popoverCSS.top = targetTop - popoverHeight - (arrowHeight - 1);
      nativeEle.className = nativeEle.className + ' popover-bottom';
    }

    arrowEle.style.top = arrowCSS.top + 'px';
    arrowEle.style.left = arrowCSS.left + 'px';

    popoverEle.style.top = popoverCSS.top + 'px';
    popoverEle.style.left = popoverCSS.left + 'px';
  }
}

class PopoverPopIn extends PopoverTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    this.positionView(ele, opts.ev);

    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let arrow = new Animation(ele.querySelector('.popover-arrow'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    arrow.fromTo('opacity', '0.01', '1');
    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.3');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(arrow)
      .add(wrapper);
  }
}
Transition.register('popover-pop-in', PopoverPopIn);


class PopoverPopOut extends PopoverTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let arrow = new Animation(ele.querySelector('.popover-arrow'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    arrow.fromTo('opacity', '1', '0');
    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.3', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(arrow)
      .add(wrapper);
  }
}
Transition.register('popover-pop-out', PopoverPopOut);


class PopoverMdPopIn extends PopoverTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    this.positionView(ele, opts.ev);

    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let arrow = new Animation(ele.querySelector('.popover-arrow'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    arrow.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper)
      .add(arrow);
  }
}
Transition.register('popover-md-pop-in', PopoverMdPopIn);


class PopoverMdPopOut extends PopoverTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let arrow = new Animation(ele.querySelector('.popover-arrow'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    arrow.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop)
      .add(wrapper)
      .add(arrow);
  }
}
Transition.register('popover-md-pop-out', PopoverMdPopOut);



class PopoverWpPopIn extends PopoverTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    this.positionView(ele, opts.ev);

    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let arrow = new Animation(ele.querySelector('.popover-arrow'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    arrow.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('cubic-bezier(0,0 0.05,1)')
      .duration(200)
      .add(backdrop)
      .add(wrapper)
      .add(arrow);
  }
}
Transition.register('popover-wp-pop-in', PopoverWpPopIn);


class PopoverWpPopOut extends PopoverTransition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let arrow = new Animation(ele.querySelector('.popover-arrow'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    arrow.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-out')
      .duration(150)
      .add(backdrop)
      .add(wrapper)
      .add(arrow);
  }
}
Transition.register('popover-wp-pop-out', PopoverWpPopOut);

let popoverIds = -1;

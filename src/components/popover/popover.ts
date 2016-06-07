import {Component, ViewChild, ViewContainerRef, DynamicComponentLoader} from '@angular/core';
import {Renderer, ElementRef} from '@angular/core';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {NavParams} from '../nav/nav-params';
import {Platform} from '../../platform/platform';
import {isPresent, isUndefined, isDefined} from '../../util/util';
import {nativeRaf, CSS} from '../../util/dom';
import {ViewController} from '../nav/view-controller';

const POPOVER_IOS_BODY_PADDING = 2;
const POPOVER_MD_BODY_PADDING = 12;

/**
 * @name Popover
 * @description
 * A Popover is a dialog that appears on top of the current page.
 * It can be used for anything, but generally it is used for overflow
 * actions that don't fit in the navigation bar.
 *
 * ### Creating
 * A popover can be created by calling the `create` method. The view
 * to display in the popover should be passed as the first argument.
 * Any data to pass to the popover view can optionally be passed in
 * the second argument. Options for the popover can optionally be
 * passed in the third argument. See the [create](#create) method
 * below for all available options.
 *
 * ### Presenting
 * To present a popover, call the `present` method on the [NavController](../../nav/NavController).
 * The first argument passed to the `present` should be the popover. In order
 * to position the popover relative to the element clicked, the event needs to be
 * passed as the second argument. If the event is not passed, the popover will be
 * positioned in the center of the current view. See the [usage](#usage) section for
 * an example of passing this event.
 *
 * ### Dismissing
 * To dismiss the popover after creation, call the `dismiss()` method on the
 * `Popover` instance. The popover can also be dismissed from within the popover's
 * view by calling the `dismiss()` method on the [ViewController](../../nav/ViewController).
 * The `onDismiss` function can be called to perform an action after the popover
 * is dismissed. The popover will dismiss when the backdrop is clicked, but this
 * can be disabled by setting `enableBackdropDismiss` to `false` in the popover
 * options.
 *
 * > Note that after the component is dismissed, it will not be usable anymore and
 * another one must be created. This can be avoided by wrapping the creation and
 * presentation of the component in a reusable function as shown in the [usage](#usage)
 * section below.
 *
 * @usage
 *
 * To open a popover on the click of a button, pass `$event` to the method
 * which creates and presents the popover:
 *
 * ```html
 * <button (click)="presentPopover($event)">
 *   <ion-icon name="more"></ion-icon>
 * </button>
 * ```
 *
 * ```ts
 * @Component({})
 * class MyPage {
 *   constructor(private nav: NavController) {}
 *
 *   presentPopover(myEvent) {
 *     let popover = Popover.create(PopoverPage);
 *     this.nav.present(popover, {
 *       ev: myEvent
 *     });
 *   }
 * }
 * ```
 *
 * The `PopoverPage` will display inside of the popover, and
 * can be anything. Below is an example of a page with items
 * that close the popover on click.
 *
 * ```ts
 * @Component({
 *   template: `
 *     <ion-list>
 *       <ion-list-header>Ionic</ion-list-header>
 *       <button ion-item (click)="close()">Learn Ionic</button>
 *       <button ion-item (click)="close()">Documentation</button>
 *       <button ion-item (click)="close()">Showcase</button>
 *       <button ion-item (click)="close()">GitHub Repo</button>
 *     </ion-list>
 *   `
 * })
 * class PopoverPage {
 *   constructor(private viewCtrl: ViewController) {}
 *
 *   close() {
 *     this.viewCtrl.dismiss();
 *   }
 * }
 * ```
 *
 *
 * @demo /docs/v2/demos/popover/
 */
export class Popover extends ViewController {

  constructor(componentType: any, data: any = {}, opts: PopoverOptions = {}) {
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
    * | enableBackdropDismiss |`boolean`   | Whether the popover should be dismissed by tapping the backdrop. Default true.                                   |
    *
    *
    * @param {object} componentType The Popover
    * @param {object} data Any data to pass to the Popover view
    * @param {object} opts Popover options
    */
   static create(componentType: any, data = {}, opts: PopoverOptions = {}) {
     return new Popover(componentType, data, opts);
   }

 }

/**
* @private
*/
@Component({
  selector: 'ion-popover',
  template:
    '<ion-backdrop (click)="bdClick($event)" [class.hide-backdrop]="!d.showBackdrop"></ion-backdrop>' +
    '<div class="popover-wrapper">' +
      '<div class="popover-arrow"></div>' +
      '<div class="popover-content">' +
        '<div class="popover-viewport">' +
          '<div #viewport></div>' +
        '</div>' +
      '</div>' +
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

  ionViewWillEnter() {
    this._loader.loadNextToLocation(this._navParams.data.componentType, this.viewport).then(componentRef => {
      this._viewCtrl.setInstance(componentRef.instance);

      // manually fire ionViewWillEnter() since PopoverCmp's ionViewWillEnter already happened
      this._viewCtrl.fireWillEnter();
    });
  }

  ionViewDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }
  }

  dismiss(role: any): Promise<any> {
    return this._viewCtrl.dismiss(null, role);
  }

  bdTouch(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
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

  mdPositionView(nativeEle: HTMLElement, ev: any) {
    let originY = 'top';
    let originX = 'left';

    let popoverWrapperEle = <HTMLElement>nativeEle.querySelector('.popover-wrapper');

    // Popover content width and height
    let popoverEle = <HTMLElement>nativeEle.querySelector('.popover-content');
    let popoverDim = popoverEle.getBoundingClientRect();
    let popoverWidth = popoverDim.width;
    let popoverHeight = popoverDim.height;

    // Window body width and height
    let bodyWidth = window.innerWidth;
    let bodyHeight = window.innerHeight;

    // If ev was passed, use that for target element
    let targetDim = ev && ev.target && ev.target.getBoundingClientRect();

    let targetTop = targetDim && targetDim.top || (bodyHeight / 2) - (popoverHeight / 2);
    let targetLeft = targetDim && targetDim.left || bodyWidth / 2 - (popoverWidth / 2);
    let targetWidth = targetDim && targetDim.width || 0;
    let targetHeight = targetDim && targetDim.height || 0;

    let popoverCSS = {
      top: targetTop,
      left: targetLeft
    };

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
      popoverCSS.left = POPOVER_MD_BODY_PADDING;
    } else if (popoverWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_MD_BODY_PADDING;
      originX = 'right';
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (targetTop + targetHeight + popoverHeight > bodyHeight && targetTop - popoverHeight > 0) {
      popoverCSS.top = targetTop - popoverHeight;
      nativeEle.className = nativeEle.className + ' popover-bottom';
      originY = 'bottom';
    // If there isn't room for it to pop up above the target cut it off
    } else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
      popoverEle.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
    }

    popoverEle.style.top = popoverCSS.top + 'px';
    popoverEle.style.left = popoverCSS.left + 'px';

    popoverEle.style[CSS.transformOrigin] = originY + ' ' + originX;

    // Since the transition starts before styling is done we
    // want to wait for the styles to apply before showing the wrapper
    popoverWrapperEle.style.opacity = '1';
  }

  iosPositionView(nativeEle: HTMLElement, ev: any) {
    let originY = 'top';
    let originX = 'left';

    let popoverWrapperEle = <HTMLElement>nativeEle.querySelector('.popover-wrapper');

    // Popover content width and height
    let popoverEle = <HTMLElement>nativeEle.querySelector('.popover-content');
    let popoverDim = popoverEle.getBoundingClientRect();
    let popoverWidth = popoverDim.width;
    let popoverHeight = popoverDim.height;

    // Window body width and height
    let bodyWidth = window.innerWidth;
    let bodyHeight = window.innerHeight;

    // If ev was passed, use that for target element
    let targetDim = ev && ev.target && ev.target.getBoundingClientRect();

    let targetTop = targetDim && targetDim.top || (bodyHeight / 2) - (popoverHeight / 2);
    let targetLeft = targetDim && targetDim.left || bodyWidth / 2;
    let targetWidth = targetDim && targetDim.width || 0;
    let targetHeight = targetDim && targetDim.height || 0;

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
    if (popoverCSS.left < POPOVER_IOS_BODY_PADDING) {
      popoverCSS.left = POPOVER_IOS_BODY_PADDING;
    } else if (popoverWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left > bodyWidth) {
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_IOS_BODY_PADDING;
      originX = 'right';
    }

    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (targetTop + targetHeight + popoverHeight > bodyHeight && targetTop - popoverHeight > 0) {
      arrowCSS.top = targetTop - (arrowHeight + 1);
      popoverCSS.top = targetTop - popoverHeight - (arrowHeight - 1);
      nativeEle.className = nativeEle.className + ' popover-bottom';
      originY = 'bottom';
      // If there isn't room for it to pop up above the target cut it off
    } else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
      popoverEle.style.bottom = POPOVER_IOS_BODY_PADDING + '%';
    }

    arrowEle.style.top = arrowCSS.top + 'px';
    arrowEle.style.left = arrowCSS.left + 'px';

    popoverEle.style.top = popoverCSS.top + 'px';
    popoverEle.style.left = popoverCSS.left + 'px';

    popoverEle.style[CSS.transformOrigin] = originY + ' ' + originX;

    // Since the transition starts before styling is done we
    // want to wait for the styles to apply before showing the wrapper
    popoverWrapperEle.style.opacity = '1';
  }
}

class PopoverPopIn extends PopoverTransition {
  constructor(private enteringView: ViewController, private leavingView: ViewController, private opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;

    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1');
    backdrop.fromTo('opacity', '0.01', '0.08');

    this
      .easing('ease')
      .duration(100)
      .add(backdrop)
      .add(wrapper);
  }

  play() {
    nativeRaf(() => {
      this.iosPositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
      super.play();
    });
  }
}
Transition.register('popover-pop-in', PopoverPopIn);


class PopoverPopOut extends PopoverTransition {
  constructor(private enteringView: ViewController, private leavingView: ViewController, private opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '1', '0');
    backdrop.fromTo('opacity', '0.08', '0');

    this
      .easing('ease')
      .duration(500)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('popover-pop-out', PopoverPopOut);


class PopoverMdPopIn extends PopoverTransition {
  constructor(private enteringView: ViewController, private leavingView: ViewController, private opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;

    let content = new Animation(ele.querySelector('.popover-content'));
    let viewport = new Animation(ele.querySelector('.popover-viewport'));

    content.fromTo('scale', '0.001', '1');
    viewport.fromTo('opacity', '0', '1');

    this
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(300)
      .add(content)
      .add(viewport);
  }

  play() {
    nativeRaf(() => {
      this.mdPositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
      super.play();
    });
  }
}
Transition.register('popover-md-pop-in', PopoverMdPopIn);


class PopoverMdPopOut extends PopoverTransition {
  constructor(private enteringView: ViewController, private leavingView: ViewController, private opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', '1', '0');

    this
      .easing('ease')
      .duration(500)
      .fadeIn()
      .add(wrapper);
  }
}
Transition.register('popover-md-pop-out', PopoverMdPopOut);


let popoverIds = -1;

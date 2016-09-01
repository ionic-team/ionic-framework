import { Component, ComponentFactoryResolver, ElementRef, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Animation } from '../../animations/animation';
import { Config } from '../../config/config';
import { CSS, nativeRaf } from '../../util/dom';
import { pascalCaseToDashCase } from '../../util/util';
import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { PageTransition } from '../../transitions/page-transition';
import { ViewController } from '../../navigation/view-controller';


/**
 * @private
 */
@Component({
  selector: 'ion-popover',
  template:
    '<ion-backdrop (click)="_bdClick()" [class.hide-backdrop]="!d.showBackdrop"></ion-backdrop>' +
    '<div class="popover-wrapper">' +
      '<div class="popover-arrow"></div>' +
      '<div class="popover-content">' +
        '<div class="popover-viewport">' +
          '<div #viewport nav-viewport></div>' +
        '</div>' +
      '</div>' +
    '</div>'
})
export class PopoverCmp {

  @ViewChild('viewport', {read: ViewContainerRef}) _viewport: ViewContainerRef;

  d: {
    cssClass?: string;
    showBackdrop?: boolean;
    enableBackdropDismiss?: boolean;
  };

  /** @private */
  _enabled: boolean;

  /** @private */
  id: number;

  constructor(
    public _cfr: ComponentFactoryResolver,
    public _elementRef: ElementRef,
    public _renderer: Renderer,
    public _config: Config,
    public _navParams: NavParams,
    public _viewCtrl: ViewController
  ) {
    this.d = _navParams.data.opts;

    _renderer.setElementClass(_elementRef.nativeElement, `popover-${_config.get('mode')}`, true);

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        // Make sure the class isn't whitespace, otherwise it throws exceptions
        if (cssClass.trim() !== '') _renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.id = (++popoverIds);
  }

  ngAfterViewInit() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }
    this._load(this._navParams.data.component);
  }

  /** @private */
  _load(component: any) {
    if (component) {
      const componentFactory = this._cfr.resolveComponentFactory(component);

      // ******** DOM WRITE ****************
      const componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
      this._viewCtrl._setInstance(componentRef.instance);

      this._setCssClass(componentRef, pascalCaseToDashCase(component.name));
      this._enabled = true;
    }
  }

  /** @private */
  _setCssClass(componentRef: any, className: string) {
    this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
  }

  _bdClick() {
    if (this._enabled && this.d.enableBackdropDismiss) {
      return this._viewCtrl.dismiss(null, 'backdrop');
    }
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this._enabled && ev.keyCode === Key.ESCAPE && this._viewCtrl.isLast()) {
      this._bdClick();
    }
  }
}


/**
 * Animations for popover
 */
class PopoverTransition extends PageTransition {

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

    let targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
    let targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2) - (popoverWidth / 2);

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

    (<any>popoverEle.style)[CSS.transformOrigin] = originY + ' ' + originX;

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

    let targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
    let targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2);
    let targetWidth = targetDim && targetDim.width || 0;
    let targetHeight = targetDim && targetDim.height || 0;

    // The arrow that shows above the popover on iOS
    var arrowEle = <HTMLElement>nativeEle.querySelector('.popover-arrow');
    let arrowDim = arrowEle.getBoundingClientRect();
    var arrowWidth = arrowDim.width;
    var arrowHeight = arrowDim.height;

    // If no ev was passed, hide the arrow
    if (!targetDim) {
      arrowEle.style.display = 'none';
    }

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

    (<any>popoverEle.style)[CSS.transformOrigin] = originY + ' ' + originX;

    // Since the transition starts before styling is done we
    // want to wait for the styles to apply before showing the wrapper
    popoverWrapperEle.style.opacity = '1';
  }
}

class PopoverPopIn extends PopoverTransition {
  init() {
    let ele = this.enteringView.pageRef().nativeElement;

    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', 0.01, 1);
    backdrop.fromTo('opacity', 0.01, 0.08);

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
PageTransition.register('popover-pop-in', PopoverPopIn);


class PopoverPopOut extends PopoverTransition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', 0.99, 0);
    backdrop.fromTo('opacity', 0.08, 0);

    this
      .easing('ease')
      .duration(500)
      .add(backdrop)
      .add(wrapper);
  }
}
PageTransition.register('popover-pop-out', PopoverPopOut);


class PopoverMdPopIn extends PopoverTransition {
  init() {
    let ele = this.enteringView.pageRef().nativeElement;
    let content = new Animation(ele.querySelector('.popover-content'));
    let viewport = new Animation(ele.querySelector('.popover-viewport'));

    content.fromTo('scale', 0.001, 1);
    viewport.fromTo('opacity', 0.01, 1);

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
PageTransition.register('popover-md-pop-in', PopoverMdPopIn);


class PopoverMdPopOut extends PopoverTransition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let wrapper = new Animation(ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', 0.99, 0);

    this
      .easing('ease')
      .duration(500)
      .fromTo('opacity', 0.01, 1)
      .add(wrapper);
  }
}
PageTransition.register('popover-md-pop-out', PopoverMdPopOut);


let popoverIds = -1;

const POPOVER_IOS_BODY_PADDING = 2;
const POPOVER_MD_BODY_PADDING = 12;

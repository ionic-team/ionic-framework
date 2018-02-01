import { Animation } from '../../animations/animation';
import { PageTransition } from '../../transitions/page-transition';


/**
 * Animations for popover
 */
export class PopoverTransition extends PageTransition {

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
    let bodyWidth = this.plt.width();
    let bodyHeight = this.plt.height();

    // If ev was passed, use that for target element
    let targetDim = ev && ev.target && ev.target.getBoundingClientRect();

    let targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
    let targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2) - (popoverWidth / 2);

    let targetHeight = targetDim && targetDim.height || 0;

    let popoverCSS: {top: any, left: any} = {
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

    (<any>popoverEle.style)[this.plt.Css.transformOrigin] = originY + ' ' + originX;

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
    let bodyWidth = this.plt.width();
    let bodyHeight = this.plt.height();

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

    let popoverCSS: {top: any, left: any} = {
      top: targetTop + targetHeight + (arrowHeight - 1),
      left: targetLeft + (targetWidth / 2) - (popoverWidth / 2)
    };

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    //
    let checkSafeAreaLeft = false;
    let checkSafeAreaRight = false;

    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    // 25 is a random/arbitrary number. It seems to work fine for ios11
    // and iPhoneX. Is it perfect? No. Does it work? Yes.
    if (popoverCSS.left < (POPOVER_IOS_BODY_PADDING + 25)) {
      checkSafeAreaLeft = true;
      popoverCSS.left = POPOVER_IOS_BODY_PADDING;
    } else if ((popoverWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left + 25) > bodyWidth) {
      // Ok, so we're on the right side of the screen,
      // but now we need to make sure we're still a bit further right
      // cus....notchurally... Again, 25 is random. It works tho
      checkSafeAreaRight = true;
      popoverCSS.left = bodyWidth - popoverWidth - POPOVER_IOS_BODY_PADDING;
      originX = 'right';
    }

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

    if (checkSafeAreaLeft) {
      if (CSS.supports('left', 'constant(safe-area-inset-left)')) {
        popoverEle.style.left = `calc(${popoverCSS.left}px + constant(safe-area-inset-left)`;

      } else if (CSS.supports('left', 'env(safe-area-inset-left)')) {
        popoverEle.style.left = `calc(${popoverCSS.left}px + env(safe-area-inset-left)`;
      }
    }

    if (checkSafeAreaRight) {
      if (CSS.supports('right', 'constant(safe-area-inset-right)')) {
        popoverEle.style.left = `calc(${popoverCSS.left}px - constant(safe-area-inset-right)`;
      } else if (CSS.supports('right', 'env(safe-area-inset-right)')) {
        popoverEle.style.left = `calc(${popoverCSS.left}px - env(safe-area-inset-right)`;
      }
    }


    (<any>popoverEle.style)[this.plt.Css.transformOrigin] = originY + ' ' + originX;

    // Since the transition starts before styling is done we
    // want to wait for the styles to apply before showing the wrapper
    popoverWrapperEle.style.opacity = '1';
  }
}


export class PopoverPopIn extends PopoverTransition {
  init() {
    let ele = this.enteringView.pageRef().nativeElement;

    let backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(this.plt, ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', 0.01, 1);
    backdrop.fromTo('opacity', 0.01, 0.08);

    this
      .easing('ease')
      .duration(100)
      .add(backdrop)
      .add(wrapper);
  }

  play() {
    this.plt.raf(() => {
      this.iosPositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
      super.play();
    });
  }
}


export class PopoverPopOut extends PopoverTransition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(this.plt, ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', 0.99, 0);
    backdrop.fromTo('opacity', 0.08, 0);

    this
      .easing('ease')
      .duration(500)
      .add(backdrop)
      .add(wrapper);
  }
}


export class PopoverMdPopIn extends PopoverTransition {
  init() {
    let ele = this.enteringView.pageRef().nativeElement;
    let content = new Animation(this.plt, ele.querySelector('.popover-content'));
    let viewport = new Animation(this.plt, ele.querySelector('.popover-viewport'));

    content.fromTo('scale', 0.001, 1);
    viewport.fromTo('opacity', 0.01, 1);

    this
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(300)
      .add(content)
      .add(viewport);
  }

  play() {
    this.plt.raf(() => {
      this.mdPositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
      super.play();
    });
  }
}


export class PopoverMdPopOut extends PopoverTransition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let wrapper = new Animation(this.plt, ele.querySelector('.popover-wrapper'));

    wrapper.fromTo('opacity', 0.99, 0);

    this
      .easing('ease')
      .duration(500)
      .fromTo('opacity', 0.01, 1)
      .add(wrapper);
  }
}


const POPOVER_IOS_BODY_PADDING = 2;
const POPOVER_MD_BODY_PADDING = 12;

import { Animation } from '../../animations/animation';
import { PageTransition } from '../../transitions/page-transition';
/**
 * Animations for popover
 */
export class PopoverTransition extends PageTransition {
    /**
     * @param {?} nativeEle
     * @param {?} ev
     * @return {?}
     */
    mdPositionView(nativeEle, ev) {
        let /** @type {?} */ originY = 'top';
        let /** @type {?} */ originX = 'left';
        let /** @type {?} */ popoverWrapperEle = (nativeEle.querySelector('.popover-wrapper'));
        // Popover content width and height
        let /** @type {?} */ popoverEle = (nativeEle.querySelector('.popover-content'));
        let /** @type {?} */ popoverDim = popoverEle.getBoundingClientRect();
        let /** @type {?} */ popoverWidth = popoverDim.width;
        let /** @type {?} */ popoverHeight = popoverDim.height;
        // Window body width and height
        let /** @type {?} */ bodyWidth = this.plt.width();
        let /** @type {?} */ bodyHeight = this.plt.height();
        // If ev was passed, use that for target element
        let /** @type {?} */ targetDim = ev && ev.target && ev.target.getBoundingClientRect();
        let /** @type {?} */ targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
        let /** @type {?} */ targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2) - (popoverWidth / 2);
        let /** @type {?} */ targetHeight = targetDim && targetDim.height || 0;
        let /** @type {?} */ popoverCSS = {
            top: targetTop,
            left: targetLeft
        };
        // If the popover left is less than the padding it is off screen
        // to the left so adjust it, else if the width of the popover
        // exceeds the body width it is off screen to the right so adjust
        if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
            popoverCSS.left = POPOVER_MD_BODY_PADDING;
        }
        else if (popoverWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left > bodyWidth) {
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
        }
        else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
            popoverEle.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
        }
        popoverEle.style.top = popoverCSS.top + 'px';
        popoverEle.style.left = popoverCSS.left + 'px';
        ((popoverEle.style))[this.plt.Css.transformOrigin] = originY + ' ' + originX;
        // Since the transition starts before styling is done we
        // want to wait for the styles to apply before showing the wrapper
        popoverWrapperEle.style.opacity = '1';
    }
    /**
     * @param {?} nativeEle
     * @param {?} ev
     * @return {?}
     */
    iosPositionView(nativeEle, ev) {
        let /** @type {?} */ originY = 'top';
        let /** @type {?} */ originX = 'left';
        let /** @type {?} */ popoverWrapperEle = (nativeEle.querySelector('.popover-wrapper'));
        // Popover content width and height
        let /** @type {?} */ popoverEle = (nativeEle.querySelector('.popover-content'));
        let /** @type {?} */ popoverDim = popoverEle.getBoundingClientRect();
        let /** @type {?} */ popoverWidth = popoverDim.width;
        let /** @type {?} */ popoverHeight = popoverDim.height;
        // Window body width and height
        let /** @type {?} */ bodyWidth = this.plt.width();
        let /** @type {?} */ bodyHeight = this.plt.height();
        // If ev was passed, use that for target element
        let /** @type {?} */ targetDim = ev && ev.target && ev.target.getBoundingClientRect();
        let /** @type {?} */ targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
        let /** @type {?} */ targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2);
        let /** @type {?} */ targetWidth = targetDim && targetDim.width || 0;
        let /** @type {?} */ targetHeight = targetDim && targetDim.height || 0;
        // The arrow that shows above the popover on iOS
        var /** @type {?} */ arrowEle = (nativeEle.querySelector('.popover-arrow'));
        let /** @type {?} */ arrowDim = arrowEle.getBoundingClientRect();
        var /** @type {?} */ arrowWidth = arrowDim.width;
        var /** @type {?} */ arrowHeight = arrowDim.height;
        // If no ev was passed, hide the arrow
        if (!targetDim) {
            arrowEle.style.display = 'none';
        }
        let /** @type {?} */ arrowCSS = {
            top: targetTop + targetHeight,
            left: targetLeft + (targetWidth / 2) - (arrowWidth / 2)
        };
        let /** @type {?} */ popoverCSS = {
            top: targetTop + targetHeight + (arrowHeight - 1),
            left: targetLeft + (targetWidth / 2) - (popoverWidth / 2)
        };
        // If the popover left is less than the padding it is off screen
        // to the left so adjust it, else if the width of the popover
        // exceeds the body width it is off screen to the right so adjust
        if (popoverCSS.left < POPOVER_IOS_BODY_PADDING) {
            popoverCSS.left = POPOVER_IOS_BODY_PADDING;
        }
        else if (popoverWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left > bodyWidth) {
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
        }
        else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
            popoverEle.style.bottom = POPOVER_IOS_BODY_PADDING + '%';
        }
        arrowEle.style.top = arrowCSS.top + 'px';
        arrowEle.style.left = arrowCSS.left + 'px';
        popoverEle.style.top = popoverCSS.top + 'px';
        popoverEle.style.left = popoverCSS.left + 'px';
        ((popoverEle.style))[this.plt.Css.transformOrigin] = originY + ' ' + originX;
        // Since the transition starts before styling is done we
        // want to wait for the styles to apply before showing the wrapper
        popoverWrapperEle.style.opacity = '1';
    }
}
export class PopoverPopIn extends PopoverTransition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.popover-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1);
        backdrop.fromTo('opacity', 0.01, 0.08);
        this
            .easing('ease')
            .duration(100)
            .add(backdrop)
            .add(wrapper);
    }
    /**
     * @return {?}
     */
    play() {
        this.plt.raf(() => {
            this.iosPositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
            super.play();
        });
    }
}
export class PopoverPopOut extends PopoverTransition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.popover-wrapper'));
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
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        let /** @type {?} */ content = new Animation(this.plt, ele.querySelector('.popover-content'));
        let /** @type {?} */ viewport = new Animation(this.plt, ele.querySelector('.popover-viewport'));
        content.fromTo('scale', 0.001, 1);
        viewport.fromTo('opacity', 0.01, 1);
        this
            .easing('cubic-bezier(0.36,0.66,0.04,1)')
            .duration(300)
            .add(content)
            .add(viewport);
    }
    /**
     * @return {?}
     */
    play() {
        this.plt.raf(() => {
            this.mdPositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
            super.play();
        });
    }
}
export class PopoverMdPopOut extends PopoverTransition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.popover-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0);
        this
            .easing('ease')
            .duration(500)
            .fromTo('opacity', 0.01, 1)
            .add(wrapper);
    }
}
const /** @type {?} */ POPOVER_IOS_BODY_PADDING = 2;
const /** @type {?} */ POPOVER_MD_BODY_PADDING = 12;
//# sourceMappingURL=popover-transitions.js.map
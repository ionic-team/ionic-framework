import { Animation } from '../animations/animation';
import { isPresent } from '../util/util';
import { PageTransition } from './page-transition';
const /** @type {?} */ TRANSLATEY = 'translateY';
const /** @type {?} */ OFF_BOTTOM = '40px';
const /** @type {?} */ CENTER = '0px';
const /** @type {?} */ SHOW_BACK_BTN_CSS = 'show-back-button';
export class MDTransition extends PageTransition {
    /**
     * @return {?}
     */
    init() {
        super.init();
        const /** @type {?} */ plt = this.plt;
        const /** @type {?} */ enteringView = this.enteringView;
        const /** @type {?} */ leavingView = this.leavingView;
        const /** @type {?} */ opts = this.opts;
        // what direction is the transition going
        const /** @type {?} */ backDirection = (opts.direction === 'back');
        if (enteringView) {
            if (backDirection) {
                this.duration(isPresent(opts.duration) ? opts.duration : 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
            }
            else {
                this.duration(isPresent(opts.duration) ? opts.duration : 280).easing('cubic-bezier(0.36,0.66,0.04,1)');
                this.enteringPage
                    .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER, true)
                    .fromTo('opacity', 0.01, 1, true);
            }
            if (enteringView.hasNavbar()) {
                const /** @type {?} */ enteringPageEle = enteringView.pageRef().nativeElement;
                const /** @type {?} */ enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                const /** @type {?} */ enteringNavBar = new Animation(plt, enteringNavbarEle);
                this.add(enteringNavBar);
                const /** @type {?} */ enteringBackButton = new Animation(plt, enteringNavbarEle.querySelector('.back-button'));
                this.add(enteringBackButton);
                if (enteringView.enableBack()) {
                    enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
                }
                else {
                    enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                }
            }
        }
        // setup leaving view
        if (leavingView && backDirection) {
            // leaving content
            this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
            const /** @type {?} */ leavingPage = new Animation(plt, leavingView.pageRef());
            this.add(leavingPage.fromTo(TRANSLATEY, CENTER, OFF_BOTTOM).fromTo('opacity', 1, 0));
        }
    }
}
//# sourceMappingURL=transition-md.js.map
import { Animation } from '../animations/animation';
import { isPresent } from '../util/util';
import { PageTransition } from './page-transition';
const /** @type {?} */ DURATION = 500;
const /** @type {?} */ EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const /** @type {?} */ OPACITY = 'opacity';
const /** @type {?} */ TRANSFORM = 'transform';
const /** @type {?} */ TRANSLATEX = 'translateX';
const /** @type {?} */ CENTER = '0%';
const /** @type {?} */ OFF_OPACITY = 0.8;
const /** @type {?} */ SHOW_BACK_BTN_CSS = 'show-back-button';
export class IOSTransition extends PageTransition {
    /**
     * @return {?}
     */
    init() {
        super.init();
        const /** @type {?} */ plt = this.plt;
        const /** @type {?} */ OFF_RIGHT = plt.isRTL ? '-99.5%' : '99.5%';
        const /** @type {?} */ OFF_LEFT = plt.isRTL ? '33%' : '-33%';
        const /** @type {?} */ enteringView = this.enteringView;
        const /** @type {?} */ leavingView = this.leavingView;
        const /** @type {?} */ opts = this.opts;
        this.duration(isPresent(opts.duration) ? opts.duration : DURATION);
        this.easing(isPresent(opts.easing) ? opts.easing : EASING);
        const /** @type {?} */ backDirection = (opts.direction === 'back');
        const /** @type {?} */ enteringHasNavbar = (enteringView && enteringView.hasNavbar());
        const /** @type {?} */ leavingHasNavbar = (leavingView && leavingView.hasNavbar());
        if (enteringView) {
            // get the native element for the entering page
            const /** @type {?} */ enteringPageEle = enteringView.pageRef().nativeElement;
            // entering content
            const /** @type {?} */ enteringContent = new Animation(plt, enteringView.contentRef());
            enteringContent.element(enteringPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
            this.add(enteringContent);
            if (backDirection) {
                // entering content, back direction
                enteringContent
                    .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
                    .fromTo(OPACITY, OFF_OPACITY, 1, true);
            }
            else {
                // entering content, forward direction
                enteringContent
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
            }
            if (enteringHasNavbar) {
                // entering page has a navbar
                const /** @type {?} */ enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                const /** @type {?} */ enteringNavBar = new Animation(plt, enteringNavbarEle);
                this.add(enteringNavBar);
                const /** @type {?} */ enteringTitle = new Animation(plt, enteringNavbarEle.querySelector('ion-title'));
                const /** @type {?} */ enteringNavbarItems = new Animation(plt, enteringNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
                const /** @type {?} */ enteringNavbarBg = new Animation(plt, enteringNavbarEle.querySelector('.toolbar-background'));
                const /** @type {?} */ enteringBackButton = new Animation(plt, enteringNavbarEle.querySelector('.back-button'));
                enteringNavBar
                    .add(enteringTitle)
                    .add(enteringNavbarItems)
                    .add(enteringNavbarBg)
                    .add(enteringBackButton);
                enteringTitle.fromTo(OPACITY, 0.01, 1, true);
                enteringNavbarItems.fromTo(OPACITY, 0.01, 1, true);
                // set properties depending on direction
                if (backDirection) {
                    // entering navbar, back direction
                    enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);
                    if (enteringView.enableBack()) {
                        // back direction, entering page has a back button
                        enteringBackButton
                            .beforeAddClass(SHOW_BACK_BTN_CSS)
                            .fromTo(OPACITY, 0.01, 1, true);
                    }
                }
                else {
                    // entering navbar, forward direction
                    enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                    enteringNavbarBg
                        .beforeClearStyles([OPACITY])
                        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
                    if (enteringView.enableBack()) {
                        // forward direction, entering page has a back button
                        enteringBackButton
                            .beforeAddClass(SHOW_BACK_BTN_CSS)
                            .fromTo(OPACITY, 0.01, 1, true);
                        const /** @type {?} */ enteringBackBtnText = new Animation(plt, enteringNavbarEle.querySelector('.back-button-text'));
                        enteringBackBtnText.fromTo(TRANSLATEX, (plt.isRTL ? '-100px' : '100px'), '0px');
                        enteringNavBar.add(enteringBackBtnText);
                    }
                    else {
                        enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                    }
                }
            }
        }
        // setup leaving view
        if (leavingView && leavingView.pageRef()) {
            // leaving content
            const /** @type {?} */ leavingPageEle = leavingView.pageRef().nativeElement;
            const /** @type {?} */ leavingContent = new Animation(plt, leavingView.contentRef());
            leavingContent.element(leavingPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
            this.add(leavingContent);
            if (backDirection) {
                // leaving content, back direction
                leavingContent
                    .beforeClearStyles([OPACITY])
                    .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
            }
            else {
                // leaving content, forward direction
                leavingContent
                    .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                    .fromTo(OPACITY, 1, OFF_OPACITY)
                    .afterClearStyles([TRANSFORM, OPACITY]);
            }
            if (leavingHasNavbar) {
                // leaving page has a navbar
                const /** @type {?} */ leavingNavbarEle = leavingPageEle.querySelector('ion-navbar');
                const /** @type {?} */ leavingNavBar = new Animation(plt, leavingNavbarEle);
                const /** @type {?} */ leavingTitle = new Animation(plt, leavingNavbarEle.querySelector('ion-title'));
                const /** @type {?} */ leavingNavbarItems = new Animation(plt, leavingNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
                const /** @type {?} */ leavingNavbarBg = new Animation(plt, leavingNavbarEle.querySelector('.toolbar-background'));
                const /** @type {?} */ leavingBackButton = new Animation(plt, leavingNavbarEle.querySelector('.back-button'));
                leavingNavBar
                    .add(leavingTitle)
                    .add(leavingNavbarItems)
                    .add(leavingBackButton)
                    .add(leavingNavbarBg);
                this.add(leavingNavBar);
                // fade out leaving navbar items
                leavingBackButton.fromTo(OPACITY, 0.99, 0);
                leavingTitle.fromTo(OPACITY, 0.99, 0);
                leavingNavbarItems.fromTo(OPACITY, 0.99, 0);
                if (backDirection) {
                    // leaving navbar, back direction
                    leavingTitle.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
                    // leaving navbar, back direction, and there's no entering navbar
                    // should just slide out, no fading out
                    leavingNavbarBg
                        .beforeClearStyles([OPACITY])
                        .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));
                    let /** @type {?} */ leavingBackBtnText = new Animation(plt, leavingNavbarEle.querySelector('.back-button-text'));
                    leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? -300 : 300) + 'px');
                    leavingNavBar.add(leavingBackBtnText);
                }
                else {
                    // leaving navbar, forward direction
                    leavingTitle
                        .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
                        .afterClearStyles([TRANSFORM]);
                    leavingBackButton.afterClearStyles([OPACITY]);
                    leavingTitle.afterClearStyles([OPACITY]);
                    leavingNavbarItems.afterClearStyles([OPACITY]);
                }
            }
        }
    }
}
//# sourceMappingURL=transition-ios.js.map
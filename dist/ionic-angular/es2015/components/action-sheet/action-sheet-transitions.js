import { Animation } from '../../animations/animation';
import { Transition } from '../../transitions/transition';
export class ActionSheetSlideIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.4);
        wrapper.fromTo('translateY', '100%', '0%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
    }
}
export class ActionSheetSlideOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.4, 0);
        wrapper.fromTo('translateY', '0%', '100%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(backdrop).add(wrapper);
    }
}
export class ActionSheetMdSlideIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.26);
        wrapper.fromTo('translateY', '100%', '0%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
    }
}
export class ActionSheetMdSlideOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.26, 0);
        wrapper.fromTo('translateY', '0%', '100%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
    }
}
export class ActionSheetWpSlideIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.16);
        wrapper.fromTo('translateY', '100%', '0%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
    }
}
export class ActionSheetWpSlideOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.1, 0);
        wrapper.fromTo('translateY', '0%', '100%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
    }
}
//# sourceMappingURL=action-sheet-transitions.js.map
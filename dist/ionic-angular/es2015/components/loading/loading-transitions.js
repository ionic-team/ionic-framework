import { Animation } from '../../animations/animation';
import { Transition } from '../../transitions/transition';
/**
 * Animations for loading
 */
export class LoadingPopIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.3);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class LoadingPopOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.3, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class LoadingMdPopIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class LoadingMdPopOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class LoadingWpPopIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.3, 1);
        backdrop.fromTo('opacity', 0.01, 0.16);
        this
            .easing('cubic-bezier(0,0,0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class LoadingWpPopOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        let /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        let /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        let /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 1.3);
        backdrop.fromTo('opacity', 0.16, 0);
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    }
}
//# sourceMappingURL=loading-transitions.js.map
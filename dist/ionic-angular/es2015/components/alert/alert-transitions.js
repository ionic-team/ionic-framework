import { Animation } from '../../animations/animation';
import { Transition } from '../../transitions/transition';
/**
 * Animations for alerts
 */
export class AlertPopIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.3);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class AlertPopOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.3, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class AlertMdPopIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class AlertMdPopOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class AlertWpPopIn extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.enteringView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.3, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('cubic-bezier(0,0,0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
}
export class AlertWpPopOut extends Transition {
    /**
     * @return {?}
     */
    init() {
        const /** @type {?} */ ele = this.leavingView.pageRef().nativeElement;
        const /** @type {?} */ backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
        const /** @type {?} */ wrapper = new Animation(this.plt, ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 1.3);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    }
}
//# sourceMappingURL=alert-transitions.js.map
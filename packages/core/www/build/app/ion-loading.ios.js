/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { domControllerAsync, playAnimationAsync } from './chunk1.js';
import { createThemedClasses, getClassMap } from './chunk2.js';

/**
 * iOS Loading Enter Animation
 */
function iosEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.loading-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.3);
    wrapperAnimation.fromTo('opacity', 0.01, 1)
        .fromTo('scale', 1.1, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * iOS Loading Leave Animation
 */
function iosLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.loading-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.3, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0)
        .fromTo('scale', 1, 0.9);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Loading Enter Animation
 */
function mdEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.loading-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.5);
    wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Loading Leave Animation
 */
function mdLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.loading-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.loading-wrapper'));
    backdropAnimation.fromTo('opacity', 0.5, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Loading {
    constructor() {
        /**
         * If true, the loading indicator will dismiss when the page changes. Defaults to `false`.
         */
        this.dismissOnPageChange = false;
        /**
         * If true, the loading indicator will be dismissed when the backdrop is clicked. Defaults to `false`.
         */
        this.enableBackdropDismiss = false;
        /**
         * If true, a backdrop will be displayed behind the loading indicator. Defaults to `true`.
         */
        this.showBackdrop = true;
        /**
         * If true, the loading indicator will be translucent. Defaults to `false`.
         */
        this.translucent = false;
        /**
         * If true, the loading indicator will animate. Defaults to `true`.
         */
        this.willAnimate = true;
    }
    /**
     * Present the loading overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionLoadingWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.loadingId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('loadingEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            if (!this.willAnimate) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.componentDidEnter();
        });
    }
    /**
     * Dismiss the loading overlay after it has been presented.
     */
    dismiss(data, role) {
        clearTimeout(this.durationTimeout);
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionLoadingWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get('loadingLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            if (!this.willAnimate) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionLoadingDidDismiss.emit({
                data,
                role
            });
        }).then(() => {
            return domControllerAsync(this.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        });
    }
    componentDidLoad() {
        if (!this.spinner) {
            this.spinner = this.config.get('loadingSpinner', this.mode === 'ios' ? 'lines' : 'crescent');
        }
        this.ionLoadingDidLoad.emit();
    }
    componentDidEnter() {
        // blur the currently active element
        const activeElement = document.activeElement;
        activeElement && activeElement.blur && activeElement.blur();
        // If there is a duration, dismiss after that amount of time
        if (typeof this.duration === 'number' && this.duration > 10) {
            this.durationTimeout = setTimeout(() => this.dismiss(), this.duration);
        }
        this.ionLoadingDidPresent.emit();
    }
    componentDidUnload() {
        this.ionLoadingDidUnload.emit();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            this.dismiss();
        }
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'loading-translucent') : {};
        return {
            class: Object.assign({}, themedClasses, getClassMap(this.cssClass))
        };
    }
    render() {
        const themedClasses = createThemedClasses(this.mode, this.color, 'loading-backdrop');
        if (this.cssClass) {
            this.cssClass.split(' ').forEach(cssClass => {
                if (cssClass.trim() !== '')
                    this.el.classList.add(cssClass);
            });
        }
        const loadingInner = [];
        if (this.spinner !== 'hide') {
            loadingInner.push(h("div", { class: 'loading-spinner' },
                h("ion-spinner", { name: this.spinner })));
        }
        if (this.content) {
            loadingInner.push(h("div", { class: 'loading-content' }, this.content));
        }
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: Object.assign({}, themedClasses, { 'hide-backdrop': !this.showBackdrop }) }),
            h("div", { class: 'loading-wrapper', role: 'dialog' }, loadingInner)
        ];
    }
    static get is() { return "ion-loading"; }
    static get host() { return { "theme": "loading" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "config": { "context": "config" }, "content": { "type": String, "attr": "content" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dismissOnPageChange": { "type": Boolean, "attr": "dismiss-on-page-change" }, "dom": { "context": "dom" }, "duration": { "type": Number, "attr": "duration" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "present": { "method": true }, "showBackdrop": { "type": Boolean, "attr": "show-backdrop" }, "spinner": { "type": String, "attr": "spinner" }, "translucent": { "type": Boolean, "attr": "translucent" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionLoadingDidLoad", "method": "ionLoadingDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionLoadingDidPresent", "method": "ionLoadingDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionLoadingWillPresent", "method": "ionLoadingWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionLoadingWillDismiss", "method": "ionLoadingWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionLoadingDidDismiss", "method": "ionLoadingDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionLoadingDidUnload", "method": "ionLoadingDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-loading {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  contain: strict;\n}\n\nion-loading ion-gesture {\n  display: block;\n  width: 100%;\n  height: 100%;\n  visibility: inherit;\n}\n\nion-loading-controller {\n  display: none;\n}\n\n.loading-backdrop {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 2;\n  display: block;\n  width: 100%;\n  height: 100%;\n  opacity: .01;\n  transform: translateZ(0);\n}\n\n.loading-wrapper {\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  opacity: 0;\n}\n\n.loading-backdrop-ios {\n  background-color: var(--ion-backdrop-ios-color, var(--ion-backdrop-color, #000));\n}\n\n.loading-ios {\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  font-size: 14px;\n}\n\n.loading-ios .loading-wrapper {\n  border-radius: 8px;\n  padding: 24px 34px;\n  max-width: 270px;\n  max-height: 90%;\n  color: var(--ion-text-ios-color, var(--ion-text-color, #000));\n  background-color: var(--ion-background-ios-color-step-50, var(--ion-background-color-step-50, #f2f2f2));\n}\n\n.loading-translucent-ios .loading-wrapper {\n  background-color: rgba(255, 255, 255, var(--ion-alpha-ios-high, var(--ion-alpha-high, 0.75)));\n  backdrop-filter: saturate(180%) blur(20px);\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n}\n\n.loading-ios .loading-content {\n  font-weight: bold;\n}\n\n.loading-ios .loading-spinner + .loading-content {\n  margin-left: 16px;\n}\n\n.loading-ios .spinner-ios line,\n.loading-ios .spinner-ios-small line {\n  stroke: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.loading-ios .spinner-bubbles circle {\n  fill: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.loading-ios .spinner-circles circle {\n  fill: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.loading-ios .spinner-crescent circle {\n  stroke: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.loading-ios .spinner-dots circle {\n  fill: var(--ion-text-ios-color-step-400, var(--ion-text-color-step-400, #666666));\n}"; }
    static get styleMode() { return "ios"; }
}

let ids = 0;
const loadings = new Map();
class LoadingController {
    create(opts) {
        // create ionic's wrapping ion-loading component
        const loadingElement = document.createElement('ion-loading');
        // give this loading a unique id
        loadingElement.loadingId = ids++;
        // convert the passed in loading options into props
        // that get passed down into the new loading
        Object.assign(loadingElement, opts);
        // append the loading element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(loadingElement);
        return loadingElement.componentOnReady();
    }
    dismiss(data, role, loadingId = -1) {
        loadingId = loadingId >= 0 ? loadingId : getHighestId();
        const loading = loadings.get(loadingId);
        return loading.dismiss(data, role);
    }
    getTop() {
        return loadings.get(getHighestId());
    }
    loadingWillPresent(ev) {
        loadings.set(ev.target.loadingId, ev.target);
    }
    loadingWillDismiss(ev) {
        loadings.delete(ev.target.loadingId);
    }
    escapeKeyUp() {
        removeLastLoading();
    }
    static get is() { return "ion-loading-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId() {
    let minimum = -1;
    loadings.forEach((_loading, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastLoading() {
    const toRemove = loadings.get(getHighestId());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

export { Loading as IonLoading, LoadingController as IonLoadingController };

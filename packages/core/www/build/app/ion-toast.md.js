/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { domControllerAsync, playAnimationAsync } from './chunk1.js';
import { createThemedClasses, getClassMap } from './chunk2.js';

/**
 * iOS Toast Enter Animation
 */
function iosEnterAnimation(Animation, baseEl, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseEl.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', '-100%', '10px');
            break;
        case 'middle':
            const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEle.clientHeight / 2);
            wrapperEle.style.top = `${topPosition}px`;
            wrapperAnimation.fromTo('opacity', 0.01, 1);
            break;
        default:
            wrapperAnimation.fromTo('translateY', '100%', '-10px');
            break;
    }
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.155,1.105,.295,1.12)')
        .duration(400)
        .add(wrapperAnimation));
}

/**
 * iOS Toast Leave Animation
 */
function iosLeaveAnimation(Animation, baseEl, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseEl.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', `${10}px`, '-100%');
            break;
        case 'middle':
            wrapperAnimation.fromTo('opacity', 0.99, 0);
            break;
        default:
            wrapperAnimation.fromTo('translateY', `${0 - 10}px`, '100%');
            break;
    }
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(300)
        .add(wrapperAnimation));
}

/**
 * MD Toast Enter Animation
 */
function mdEnterAnimation(Animation, baseEl, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseEl.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', '-100%', '0%');
            break;
        case 'middle':
            const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEle.clientHeight / 2);
            wrapperEle.style.top = `${topPosition}px`;
            wrapperAnimation.fromTo('opacity', 0.01, 1);
            break;
        default:
            wrapperAnimation.fromTo('translateY', '100%', '0%');
            break;
    }
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(wrapperAnimation));
}

/**
 * md Toast Leave Animation
 */
function mdLeaveAnimation(Animation, baseEl, position) {
    const baseAnimation = new Animation();
    const wrapperAnimation = new Animation();
    const wrapperEle = baseEl.querySelector('.toast-wrapper');
    wrapperAnimation.addElement(wrapperEle);
    switch (position) {
        case 'top':
            wrapperAnimation.fromTo('translateY', '0px', '-100%');
            break;
        case 'middle':
            wrapperAnimation.fromTo('opacity', 0.99, 0);
            break;
        default:
            wrapperAnimation.fromTo('translateY', `0px`, '100%');
            break;
    }
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(300)
        .add(wrapperAnimation));
}

class Toast {
    constructor() {
        /**
         * If true, the close button will be displayed. Defaults to `false`.
         */
        this.showCloseButton = false;
        /**
         * If true, the toast will be translucent. Defaults to `false`.
         */
        this.translucent = false;
        /**
         * If true, the toast will animate. Defaults to `true`.
         */
        this.willAnimate = true;
    }
    /**
     * Present the toast overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionToastWillPresent.emit();
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('toastEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el, this.position).then(animation => {
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
     * Dismiss the toast overlay after it has been presented.
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionToastWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get('toastLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el, this.position).then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionToastDidDismiss.emit({
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
        this.ionToastDidLoad.emit();
    }
    componentDidEnter() {
        this.ionToastDidPresent.emit();
        if (this.duration) {
            setTimeout(() => {
                this.dismiss();
            }, this.duration);
        }
    }
    componentDidUnload() {
        this.ionToastDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    wrapperClass() {
        const position = this.position ? this.position : 'bottom';
        return {
            'toast-wrapper': true,
            [`toast-${position}`]: true
        };
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'toast-translucent') : {};
        return {
            class: Object.assign({}, themedClasses, getClassMap(this.cssClass))
        };
    }
    render() {
        return (h("div", { class: this.wrapperClass() },
            h("div", { class: 'toast-container' },
                this.message
                    ? h("div", { class: 'toast-message' }, this.message)
                    : null,
                this.showCloseButton
                    ? h("ion-button", { fill: 'clear', color: 'light', class: 'toast-button', onClick: () => this.dismiss() }, this.closeButtonText || 'Close')
                    : null)));
    }
    static get is() { return "ion-toast"; }
    static get host() { return { "theme": "toast" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "closeButtonText": { "type": String, "attr": "close-button-text" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dismissOnPageChange": { "type": Boolean, "attr": "dismiss-on-page-change" }, "dom": { "context": "dom" }, "duration": { "type": Number, "attr": "duration" }, "el": { "elementRef": true }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "message": { "type": String, "attr": "message" }, "position": { "type": String, "attr": "position" }, "present": { "method": true }, "showCloseButton": { "type": Boolean, "attr": "show-close-button" }, "translucent": { "type": Boolean, "attr": "translucent" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionToastDidLoad", "method": "ionToastDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastDidPresent", "method": "ionToastDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastWillPresent", "method": "ionToastWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastWillDismiss", "method": "ionToastWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastDidDismiss", "method": "ionToastDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionToastDidUnload", "method": "ionToastDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-toast {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 1000;\n  display: block;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  contain: strict;\n}\n\n.toast-container {\n  display: flex;\n  align-items: center;\n  pointer-events: auto;\n  contain: content;\n}\n\n.toast-button {\n  font-size: 15px;\n}\n\n.toast-message {\n  flex: 1;\n}\n\n.toast-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n.toast-md .toast-wrapper {\n  left: 0;\n  right: 0;\n  margin: auto;\n  position: absolute;\n  z-index: 10;\n  display: block;\n  width: 100%;\n  max-width: 700px;\n  background: var(--ion-text-md-color-step-150, var(--ion-text-color-step-150, #262626));\n}\n\n.toast-md .toast-wrapper.toast-top {\n  transform: translate3d(0,  -100%,  0);\n  top: 0;\n}\n\n.toast-md .toast-wrapper.toast-bottom {\n  transform: translate3d(0,  100%,  0);\n  bottom: 0;\n}\n\n.toast-md .toast-wrapper.toast-middle {\n  opacity: .01;\n}\n\n.toast-md .toast-message {\n  padding: 19px 16px 17px;\n  font-size: 15px;\n  color: var(--ion-background-md-color, var(--ion-background-color, #fff));\n}"; }
    static get styleMode() { return "md"; }
}

let ids = 0;
const toasts = new Map();
class ToastController {
    create(opts) {
        // create ionic's wrapping ion-toast component
        const toastElement = document.createElement('ion-toast');
        // give this toast a unique id
        toastElement.toastId = ids++;
        // convert the passed in toast options into props
        // that get passed down into the new toast
        Object.assign(toastElement, opts);
        // append the toast element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(toastElement);
        return toastElement.componentOnReady();
    }
    dismiss(data, role, toastId = -1) {
        toastId = toastId >= 0 ? toastId : getHighestId();
        const toast = toasts.get(toastId);
        if (!toast) {
            return Promise.reject('toast does not exist');
        }
        return toast.dismiss(data, role);
    }
    getTop() {
        return toasts.get(getHighestId());
    }
    toastWillPresent(ev) {
        toasts.set(ev.target.toastId, ev.target);
    }
    toastWillDismiss(ev) {
        toasts.delete(ev.target.toastId);
    }
    escapeKeyUp() {
        removeLastToast();
    }
    static get is() { return "ion-toast-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId() {
    let minimum = -1;
    toasts.forEach((_toast, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastToast() {
    const toRemove = toasts.get(getHighestId());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

export { Toast as IonToast, ToastController as IonToastController };

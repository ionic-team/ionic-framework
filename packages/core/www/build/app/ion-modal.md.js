/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { DomFrameworkDelegate } from './chunk3.js';
import { domControllerAsync, playAnimationAsync } from './chunk1.js';
import { createThemedClasses } from './chunk2.js';

/**
 * iOS Modal Enter Animation
 */
function iosEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateY', '100%', '0%');
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));
}
/**
 * Animations for modals
 */
// export function modalSlideIn(rootEl: HTMLElement) {
// }
// export class ModalSlideOut {
//   constructor(el: HTMLElement) {
//     let backdrop = new Animation(this.plt, el.querySelector('ion-backdrop'));
//     let wrapperEle = <HTMLElement>el.querySelector('.modal-wrapper');
//     let wrapperEleRect = wrapperEle.getBoundingClientRect();
//     let wrapper = new Animation(this.plt, wrapperEle);
//     // height of the screen - top of the container tells us how much to scoot it down
//     // so it's off-screen
//     wrapper.fromTo('translateY', '0px', `${this.plt.height() - wrapperEleRect.top}px`);
//     backdrop.fromTo('opacity', 0.4, 0.0);
//     this
//       .element(this.leavingView.pageRef())
//       .easing('ease-out')
//       .duration(250)
//       .add(backdrop)
//       .add(wrapper);
//   }
// }
// export class ModalMDSlideIn {
//   constructor(el: HTMLElement) {
//     const backdrop = new Animation(this.plt, el.querySelector('ion-backdrop'));
//     const wrapper = new Animation(this.plt, el.querySelector('.modal-wrapper'));
//     backdrop.fromTo('opacity', 0.01, 0.4);
//     wrapper.fromTo('translateY', '40px', '0px');
//     wrapper.fromTo('opacity', 0.01, 1);
//     const DURATION = 280;
//     const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
//     this.element(this.enteringView.pageRef()).easing(EASING).duration(DURATION)
//       .add(backdrop)
//       .add(wrapper);
//   }
// }
// export class ModalMDSlideOut {
//   constructor(el: HTMLElement) {
//     const backdrop = new Animation(this.plt, el.querySelector('ion-backdrop'));
//     const wrapper = new Animation(this.plt, el.querySelector('.modal-wrapper'));
//     backdrop.fromTo('opacity', 0.4, 0.0);
//     wrapper.fromTo('translateY', '0px', '40px');
//     wrapper.fromTo('opacity', 0.99, 0);
//     this
//       .element(this.leavingView.pageRef())
//       .duration(200)
//       .easing('cubic-bezier(0.47,0,0.745,0.715)')
//       .add(wrapper)
//       .add(backdrop);
//   }
// }

/**
 * iOS Modal Leave Animation
 */
function iosLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    const wrapperElRect = wrapperEl.getBoundingClientRect();
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateY', '0%', `${window.innerHeight - wrapperElRect.top}px`);
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-out')
        .duration(250)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Modal Enter Animation
 */
function mdEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation
        .fromTo('opacity', 0.01, 1)
        .fromTo('translateY', '40px', '0px');
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(280)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Modal Leave Animation
 */
function mdLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.modal-backdrop'));
    const wrapperAnimation = new Animation();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    wrapperAnimation
        .fromTo('opacity', 0.99, 0)
        .fromTo('translateY', '0px', '40px');
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.47,0,0.745,0.715)')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Modal {
    constructor() {
        this.data = {};
        /**
         * If true, the modal will be dismissed when the backdrop is clicked. Defaults to `true`.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, a backdrop will be displayed behind the modal. Defaults to `true`.
         */
        this.showBackdrop = true;
        /**
         * If true, the modal will animate. Defaults to `true`.
         */
        this.willAnimate = true;
    }
    /**
     * Present the modal overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionModalWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.modalId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('modalEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
        const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
        if (!this.delegate) {
            this.delegate = new DomFrameworkDelegate();
        }
        const cssClasses = [];
        if (this.cssClass && this.cssClass.length) {
            cssClasses.push(this.cssClass);
        }
        // add the modal by default to the data being passed
        this.data = this.data || {};
        this.data.modal = this.el;
        this.delegate.attachViewToDom(userComponentParent, this.component, this.data, cssClasses)
            .then((mountingData) => {
            this.usersComponentElement = mountingData.element;
        });
        return this.animationCtrl.create(animationBuilder, this.el)
            .then(animation => {
            this.animation = animation;
            if (!this.willAnimate)
                this.animation = animation.duration(0);
            return playAnimationAsync(animation);
        })
            .then((animation) => {
            animation.destroy();
            this.ionModalDidPresent.emit();
        });
    }
    /**
     * Dismiss the modal overlay after it has been presented.
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionModalWillDismiss.emit({ data, role });
        if (!this.delegate) {
            this.delegate = new DomFrameworkDelegate();
        }
        // get the user's animation fn if one was provided
        const animationBuilder = this.leaveAnimation || this.config.get('modalLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el)
            .then(animation => {
            this.animation = animation;
            if (!this.willAnimate) {
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        })
            .then((animation) => {
            animation.destroy();
            this.ionModalDidDismiss.emit({ data, role });
        })
            .then(() => {
            return domControllerAsync(this.dom.write, () => {
                const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
                this.delegate.removeViewFromDom(userComponentParent, this.usersComponentElement);
                this.el.parentNode.removeChild(this.el);
            });
        });
    }
    getUserComponentContainer() {
        return this.el.querySelector(`.${USER_COMPONENT_MODAL_CONTAINER_CLASS}`);
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    componentDidLoad() {
        this.ionModalDidLoad.emit();
    }
    componentDidUnload() {
        this.ionModalDidUnload.emit();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            // const opts: NavOptions = {
            //   minClickBlockDuration: 400
            // };
            this.dismiss();
        }
    }
    render() {
        const backdropClasses = createThemedClasses(this.mode, this.color, 'modal-backdrop');
        const dialogClasses = createThemedClasses(this.mode, this.color, 'modal-wrapper');
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: Object.assign({}, backdropClasses, { 'hide-backdrop': !this.showBackdrop }) }),
            h("div", { role: 'dialog', class: dialogClasses })
        ];
    }
    static get is() { return "ion-modal"; }
    static get host() { return { "theme": "modal" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "color": { "type": String, "attr": "color" }, "component": { "type": "Any", "attr": "component" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "data": { "type": "Any", "attr": "data" }, "delegate": { "type": "Any", "attr": "delegate", "mutable": true }, "dismiss": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "getUserComponentContainer": { "method": true }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "modalId": { "type": Number, "attr": "modal-id" }, "mode": { "type": "Any", "attr": "mode" }, "present": { "method": true }, "showBackdrop": { "type": Boolean, "attr": "show-backdrop" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionModalDidLoad", "method": "ionModalDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalDidPresent", "method": "ionModalDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalWillPresent", "method": "ionModalWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalWillDismiss", "method": "ionModalWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalDidDismiss", "method": "ionModalDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionModalDidUnload", "method": "ionModalDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-modal {\n  left: 0;\n  top: 0;\n  position: absolute;\n  display: block;\n  width: 100%;\n  height: 100%;\n  contain: strict;\n}\n\nion-modal-controller {\n  display: none;\n}\n\n.modal-backdrop {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 2;\n  display: block;\n  width: 100%;\n  height: 100%;\n  opacity: .01;\n  transform: translateZ(0);\n}\n\n\@media not all and (min-width: 768px) and (min-height: 600px) {\n  .modal-backdrop {\n    visibility: hidden;\n  }\n}\n\n.modal-backdrop.backdrop-no-tappable {\n  cursor: auto;\n}\n\n.modal-backdrop.hide-backdrop {\n  visibility: hidden;\n}\n\n.modal-wrapper {\n  z-index: 10;\n  height: 100%;\n  contain: strict;\n}\n\n\@media only screen and (min-width: 768px) and (min-height: 600px) {\n  .modal-wrapper {\n    left: calc(50% - (600px/2));\n    top: calc(50% - (500px/2));\n    position: absolute;\n    width: 600px;\n    height: 500px;\n  }\n}\n\n\@media only screen and (min-width: 768px) and (min-height: 768px) {\n  .modal-wrapper {\n    left: calc(50% - (600px/2));\n    top: calc(50% - (600px/2));\n    position: absolute;\n    width: 600px;\n    height: 600px;\n  }\n}\n\n.modal-backdrop-md {\n  background-color: var(--ion-backdrop-md-color, var(--ion-backdrop-color, #000));\n}\n\n.modal-wrapper-md {\n  transform: translate3d(0,  40px,  0);\n  opacity: .01;\n}\n\n\@media only screen and (min-width: 768px) and (min-height: 600px) {\n  .modal-wrapper-md {\n    border-radius: 2px;\n    overflow: hidden;\n    box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);\n  }\n}"; }
    static get styleMode() { return "md"; }
}
const USER_COMPONENT_MODAL_CONTAINER_CLASS = 'modal-wrapper';

let ids = 0;
const modals = new Map();
class ModalController {
    create(opts) {
        // create ionic's wrapping ion-modal component
        const modalElement = document.createElement('ion-modal');
        // give this modal a unique id
        modalElement.modalId = ids++;
        // convert the passed in modal options into props
        // that get passed down into the new modal
        Object.assign(modalElement, opts);
        // append the modal element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(modalElement);
        return modalElement.componentOnReady();
    }
    dismiss(data, role, modalId = -1) {
        modalId = modalId >= 0 ? modalId : getHighestId();
        const modal = modals.get(modalId);
        if (!modal) {
            return Promise.reject('modal does not exist');
        }
        return modal.dismiss(data, role);
    }
    getTop() {
        return modals.get(getHighestId());
    }
    modalWillPresent(ev) {
        modals.set(ev.target.modalId, ev.target);
    }
    modalWillDismiss(ev) {
        modals.delete(ev.target.modalId);
    }
    escapeKeyUp() {
        removeLastModal();
    }
    static get is() { return "ion-modal-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId() {
    let minimum = -1;
    modals.forEach((_modal, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastModal() {
    const toRemove = modals.get(getHighestId());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

export { Modal as IonModal, ModalController as IonModalController };

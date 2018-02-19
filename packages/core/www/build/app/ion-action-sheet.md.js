/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { domControllerAsync, isDef, playAnimationAsync } from './chunk1.js';
import { createThemedClasses, getClassMap } from './chunk2.js';
import { DomFrameworkDelegate } from './chunk3.js';

/**
 * iOS Action Sheet Enter Animation
 */
function iosEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * iOS Action Sheet Leave Animation
 */
function iosLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.4, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * MD Action Sheet Enter Animation
 */
function mdEnterAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.26);
    wrapperAnimation.fromTo('translateY', '100%', '0%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * MD Action Sheet Leave Animation
 */
function mdLeaveAnimation(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.action-sheet-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'));
    backdropAnimation.fromTo('opacity', 0.26, 0);
    wrapperAnimation.fromTo('translateY', '0%', '100%');
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.36,.66,.04,1)')
        .duration(450)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

class ActionSheet {
    constructor() {
        this.animation = null;
        /**
         * If true, the action sheet will be dismissed when the backdrop is clicked. Defaults to `true`.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, the action sheet will be translucent. Defaults to `false`.
         */
        this.translucent = false;
        /**
         * If true, the action sheet will animate. Defaults to `true`.
         */
        this.willAnimate = true;
    }
    /**
     * Present the action sheet overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionActionSheetWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.actionSheetId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('actionSheetEnter', this.mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
        // build the animation and kick it off
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            // Check if prop animate is false or if the config for animate is defined/false
            if (!this.willAnimate || (isDef(this.config.get('willAnimate')) && this.config.get('willAnimate') === false)) {
                // if the duration is 0, it won't actually animate I don't think
                // TODO - validate this
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionActionSheetDidPresent.emit();
        });
    }
    /**
     * Dismiss the action sheet overlay after it has been presented.
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionActionSheetWillDismiss.emit({
            data,
            role
        });
        const animationBuilder = this.leaveAnimation || this.config.get('actionSheetLeave', this.mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            if (!this.willAnimate || (isDef(this.config.get('willAnimate')) && this.config.get('willAnimate') === false)) {
                this.animation = animation.duration(0);
            }
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionActionSheetDidDismiss.emit({
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
        this.ionActionSheetDidLoad.emit();
    }
    componentDidUnload() {
        this.ionActionSheetDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            this.dismiss();
        }
    }
    buttonClick(button) {
        let shouldDismiss = true;
        if (button.handler) {
            if (button.handler() === false) {
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss();
        }
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'action-sheet-translucent') : {};
        return {
            class: Object.assign({}, themedClasses, getClassMap(this.cssClass))
        };
    }
    render() {
        const allButtons = this.buttons.map(b => {
            if (typeof b === 'string') {
                b = { text: b };
            }
            if (!b.cssClass) {
                b.cssClass = '';
            }
            return b;
        });
        const cancelButton = allButtons.find(b => b.role === 'cancel');
        const buttons = allButtons.filter(b => b.role !== 'cancel');
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: 'action-sheet-backdrop' }),
            h("div", { class: 'action-sheet-wrapper', role: 'dialog' },
                h("div", { class: 'action-sheet-container' },
                    h("div", { class: 'action-sheet-group' },
                        this.title
                            ? h("div", { class: 'action-sheet-title' },
                                this.title,
                                this.subTitle
                                    ? h("div", { class: 'action-sheet-sub-title' }, this.subTitle)
                                    : null)
                            : null,
                        buttons.map(b => h("button", { class: buttonClass(b), onClick: () => this.buttonClick(b) },
                            h("span", { class: 'action-sheet-button-inner' },
                                b.icon
                                    ? h("ion-icon", { name: b.icon, class: 'action-sheet-icon' })
                                    : null,
                                b.text)))),
                    cancelButton
                        ? h("div", { class: 'action-sheet-group action-sheet-group-cancel' },
                            h("button", { class: buttonClass(cancelButton), onClick: () => this.buttonClick(cancelButton) },
                                h("span", { class: 'action-sheet-button-inner' },
                                    cancelButton.icon
                                        ? h("ion-icon", { name: cancelButton.icon, class: 'action-sheet-icon' })
                                        : null,
                                    cancelButton.text)))
                        : null))
        ];
    }
    static get is() { return "ion-action-sheet"; }
    static get host() { return { "theme": "action-sheet" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "buttons": { "type": "Any", "attr": "buttons" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "present": { "method": true }, "subTitle": { "type": String, "attr": "sub-title" }, "title": { "type": String, "attr": "title" }, "translucent": { "type": Boolean, "attr": "translucent" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionActionSheetDidLoad", "method": "ionActionSheetDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidPresent", "method": "ionActionSheetDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetWillPresent", "method": "ionActionSheetWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetWillDismiss", "method": "ionActionSheetWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidDismiss", "method": "ionActionSheetDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionActionSheetDidUnload", "method": "ionActionSheetDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-action-sheet {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 1000;\n  display: block;\n  width: 100%;\n  height: 100%;\n  font-smoothing: antialiased;\n  -webkit-font-smoothing: antialiased;\n}\n\n.action-sheet-wrapper {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  transform: translate3d(0,  100%,  0);\n  position: absolute;\n  z-index: 10;\n  display: block;\n  width: 100%;\n  max-width: 500px;\n  pointer-events: none;\n}\n\n.action-sheet-button {\n  width: 100%;\n  border: 0;\n  font-family: inherit;\n}\n\n.action-sheet-button:active, .action-sheet-button:focus {\n  outline: none;\n}\n\n.action-sheet-button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.action-sheet-container {\n  display: flex;\n  flex-flow: column;\n  justify-content: flex-end;\n  height: 100%;\n  max-height: 100%;\n}\n\n.action-sheet-group {\n  overflow: scroll;\n  flex-shrink: 2;\n  pointer-events: all;\n}\n\n.action-sheet-group-cancel {\n  overflow: hidden;\n  flex-shrink: 0;\n}\n\n.action-sheet-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n}\n\n.action-sheet-md .action-sheet-title {\n  padding: 11px 16px 17px;\n  text-align: left;\n  text-align: start;\n  font-size: 16px;\n  color: var(--ion-text-md-color-step-400, var(--ion-text-color-step-400, #666666));\n}\n\n.action-sheet-md .action-sheet-sub-title {\n  padding: 16px 0 0;\n  font-size: 14px;\n}\n\n.action-sheet-md .action-sheet-group {\n  background-color: var(--ion-overlay-md-background-color, var(--ion-overlay-background-color, #fafafa));\n}\n\n.action-sheet-md .action-sheet-group:first-child {\n  padding-top: 8px;\n}\n\n.action-sheet-md .action-sheet-group:last-child {\n  padding-bottom: 8px;\n}\n\n.action-sheet-md .action-sheet-button {\n  padding: 0 16px;\n  text-align: left;\n  text-align: start;\n  position: relative;\n  overflow: hidden;\n  height: 48px;\n  font-size: 16px;\n  color: var(--ion-text-md-color-step-150, var(--ion-text-color-step-150, #262626));\n  background: transparent;\n  contain: strict;\n}\n\n.action-sheet-md .action-sheet-button.activated {\n  background: var(--ion-background-md-color-step-50, var(--ion-background-color-step-50, #f2f2f2));\n}\n\n.action-sheet-md .action-sheet-icon {\n  margin: 0 32px 0 0;\n  font-size: 24px;\n}\n\n.action-sheet-md .action-sheet-button-inner {\n  justify-content: flex-start;\n}\n\n.action-sheet-md .action-sheet-selected {\n  font-weight: bold;\n}"; }
    static get styleMode() { return "md"; }
}
function buttonClass(button) {
    const buttonClasses = Object.assign({ 'action-sheet-button': true }, getClassMap(button.cssClass));
    if (button.role) {
        buttonClasses[`action-sheet-${button.role}`] = true;
    }
    return buttonClasses;
}

let ids = 0;
const actionSheets = new Map();
class ActionSheetController {
    create(opts) {
        // create ionic's wrapping ion-actionSheet component
        const actionSheetElement = document.createElement('ion-action-sheet');
        // give this actionSheet a unique id
        actionSheetElement.actionSheetId = ids++;
        // convert the passed in actionSheet options into props
        // that get passed down into the new actionSheet
        Object.assign(actionSheetElement, opts);
        // append the actionSheet element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(actionSheetElement);
        return actionSheetElement.componentOnReady();
    }
    dismiss(data, role, actionSheetId = -1) {
        actionSheetId = actionSheetId >= 0 ? actionSheetId : getHighestId();
        const actionSheet = actionSheets.get(actionSheetId);
        if (!actionSheet) {
            return Promise.reject('action-sheet does not exist');
        }
        return actionSheet.dismiss(data, role);
    }
    getTop() {
        return actionSheets.get(getHighestId());
    }
    actionSheetWillPresent(ev) {
        actionSheets.set(ev.target.actionSheetId, ev.target);
    }
    actionSheetWillDismiss(ev) {
        actionSheets.delete(ev.target.actionSheetId);
    }
    escapeKeyUp() {
        removeLastActionSheet();
    }
    static get is() { return "ion-action-sheet-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId() {
    let minimum = -1;
    actionSheets.forEach((_actionSheet, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastActionSheet() {
    const toRemove = actionSheets.get(getHighestId());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

const BACKDROP = 'backdrop';

/**
 * iOS Alert Enter Animation
 */
function iosEnterAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.01, 0.3);
    wrapperAnimation.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * iOS Alert Leave Animation
 */
function iosLeaveAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.3, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    const ani = baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation);
    return Promise.resolve(ani);
}

/**
 * Md Alert Enter Animation
 */
function mdEnterAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
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
 * Md Alert Leave Animation
 */
function mdLeaveAnimation$1(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.alert-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'));
    backdropAnimation.fromTo('opacity', 0.5, 0);
    wrapperAnimation.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(200)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Alert {
    constructor() {
        this.animation = null;
        this.inputType = null;
        /**
         * Array of buttons to be added to the alert.
         */
        this.buttons = [];
        /**
         * Array of input to show in the alert.
         */
        this.inputs = [];
        /**
         * If true, the alert will be dismissed when the backdrop is clicked. Defaults to `true`.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, the alert will be translucent. Defaults to `false`.
         */
        this.translucent = false;
        /**
         * If true, the alert will animate. Defaults to `true`.
         */
        this.willAnimate = true;
    }
    /**
     * Present the alert overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionAlertWillPresent.emit();
        this.el.style.zIndex = `${20000 + this.alertId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('alertEnter', this.mode === 'ios' ? iosEnterAnimation$1 : mdEnterAnimation$1);
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
            const firstInput = this.el.querySelector('[tabindex]');
            if (firstInput) {
                firstInput.focus();
            }
            this.ionAlertDidPresent.emit();
        });
    }
    /**
     * Dismiss the alert
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionAlertWillDismiss.emit({
            data: data,
            role: role
        });
        // get the user's animation fn if one was provided
        const animationBuilder = this.leaveAnimation || this.config.get('alertLeave', this.mode === 'ios' ? iosLeaveAnimation$1 : mdLeaveAnimation$1);
        return this.animationCtrl.create(animationBuilder, this.el).then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        }).then((animation) => {
            animation.destroy();
            this.ionAlertDidDismiss.emit({
                data: data,
                role: role
            });
        }).then(() => {
            return domControllerAsync(this.dom.write, () => {
                this.el.parentNode.removeChild(this.el);
            });
        });
    }
    componentDidLoad() {
        this.ionAlertDidLoad.emit();
    }
    componentDidEnter() {
        this.ionAlertDidPresent.emit();
    }
    componentDidUnload() {
        this.ionAlertDidUnload.emit();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            this.dismiss(null, BACKDROP);
        }
    }
    rbClick(inputIndex) {
        this.inputs = this.inputs.map((input, index) => {
            input.checked = (inputIndex === index);
            return input;
        });
        const rbButton = this.inputs[inputIndex];
        this.activeId = rbButton.id;
        if (rbButton.handler) {
            rbButton.handler(rbButton);
        }
    }
    cbClick(inputIndex) {
        this.inputs = this.inputs.map((input, index) => {
            if (inputIndex === index) {
                input.checked = !input.checked;
            }
            return input;
        });
        const cbButton = this.inputs[inputIndex];
        if (cbButton.handler) {
            cbButton.handler(cbButton);
        }
    }
    buttonClick(button) {
        let shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            if (button.handler(this.getValues()) === false) {
                // if the return value of the handler is false then do not dismiss
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            this.dismiss(this.getValues(), button.role);
        }
    }
    getValues() {
        if (this.inputType === 'radio') {
            // this is an alert with radio buttons (single value select)
            // return the one value which is checked, otherwise undefined
            const checkedInput = this.inputs.find(i => i.checked);
            console.debug('returning', checkedInput ? checkedInput.value : undefined);
            return checkedInput ? checkedInput.value : undefined;
        }
        if (this.inputType === 'checkbox') {
            // this is an alert with checkboxes (multiple value select)
            // return an array of all the checked values
            console.debug('returning', this.inputs.filter(i => i.checked).map(i => i.value));
            return this.inputs.filter(i => i.checked).map(i => i.value);
        }
        if (this.inputs.length === 0) {
            // this is an alert without any options/inputs at all
            console.debug('returning', 'undefined');
            return undefined;
        }
        // this is an alert with text inputs
        // return an object of all the values with the input name as the key
        const values = {};
        this.inputs.forEach(i => {
            values[i.name] = i.value;
        });
        console.debug('returning', values);
        return values;
    }
    renderCheckbox(inputs) {
        if (inputs.length === 0)
            return null;
        return (h("div", { class: 'alert-checkbox-group' }, inputs.map((i, index) => (h("button", { onClick: () => this.cbClick(index), "aria-checked": i.checked, id: i.id, disabled: i.disabled, tabIndex: 0, role: 'checkbox', class: 'alert-tappable alert-checkbox alert-checkbox-button' },
            h("div", { class: 'alert-button-inner' },
                h("div", { class: 'alert-checkbox-icon' },
                    h("div", { class: 'alert-checkbox-inner' })),
                h("div", { class: 'alert-checkbox-label' }, i.label)))))));
    }
    renderRadio(inputs) {
        if (inputs.length === 0)
            return null;
        return (h("div", { class: 'alert-radio-group', role: 'radiogroup', "aria-labelledby": this.hdrId, "aria-activedescendant": this.activeId }, inputs.map((i, index) => (h("button", { onClick: () => this.rbClick(index), "aria-checked": i.checked, disabled: i.disabled, id: i.id, tabIndex: 0, class: 'alert-radio-button alert-tappable alert-radio', role: 'radio' },
            h("div", { class: 'alert-button-inner' },
                h("div", { class: 'alert-radio-icon' },
                    h("div", { class: 'alert-radio-inner' })),
                h("div", { class: 'alert-radio-label' }, i.label)))))));
    }
    renderInput(inputs) {
        if (inputs.length === 0)
            return null;
        return (h("div", { class: 'alert-input-group' }, inputs.map(i => (h("div", { class: 'alert-input-wrapper' },
            h("input", { placeholder: i.placeholder, value: i.value, type: i.type, min: i.min, max: i.max, id: i.id, disabled: i.disabled, tabIndex: 0, class: 'alert-input' }))))));
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'alert-translucent') : {};
        return {
            class: Object.assign({}, themedClasses, getClassMap(this.cssClass)),
            id: this.alertId
        };
    }
    render() {
        const hdrId = `${this.alertId}-hdr`;
        const subHdrId = `${this.alertId}-sub-hdr`;
        const msgId = `${this.alertId}-msg`;
        if (this.title || !this.subTitle) {
            this.hdrId = hdrId;
        }
        else if (this.subTitle) {
            this.hdrId = subHdrId;
        }
        const alertButtonGroupClass = {
            'alert-button-group': true,
            'alert-button-group-vertical': this.buttons.length > 2
        };
        const buttons = this.buttons.map(b => {
            if (typeof b === 'string') {
                return { text: b };
            }
            return b;
        })
            .filter(b => b !== null);
        this.inputs = this.inputs.map((i, index) => {
            return {
                type: i.type || 'text',
                name: i.name ? i.name : index + '',
                placeholder: i.placeholder ? i.placeholder : '',
                value: i.value ? i.value : '',
                label: i.label,
                checked: !!i.checked,
                disabled: !!i.disabled,
                id: i.id ? i.id : `alert-input-${this.alertId}-${index}`,
                handler: i.handler ? i.handler : null,
                min: i.min ? i.min : null,
                max: i.max ? i.max : null
            };
        }).filter(i => i !== null);
        // An alert can be created with several different inputs. Radios,
        // checkboxes and inputs are all accepted, but they cannot be mixed.
        const inputTypes = [];
        this.inputs.forEach(i => {
            if (inputTypes.indexOf(i.type) < 0) {
                inputTypes.push(i.type);
            }
        });
        if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
            console.warn(`Alert cannot mix input types: ${(inputTypes.join('/'))}. Please see alert docs for more info.`);
        }
        this.inputType = inputTypes.length > 0 ? inputTypes[0] : null;
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: 'alert-backdrop' }),
            h("div", { class: 'alert-wrapper' },
                h("div", { class: 'alert-head' },
                    this.title
                        ? h("h2", { id: hdrId, class: 'alert-title' }, this.title)
                        : null,
                    this.subTitle
                        ? h("h2", { id: subHdrId, class: 'alert-sub-title' }, this.subTitle)
                        : null),
                h("div", { id: msgId, class: 'alert-message', innerHTML: this.message }),
                (() => {
                    switch (this.inputType) {
                        case 'checkbox': return this.renderCheckbox(this.inputs);
                        case 'radio': return this.renderRadio(this.inputs);
                        default: return this.renderInput(this.inputs);
                    }
                })(),
                h("div", { class: alertButtonGroupClass }, buttons.map(b => h("button", { class: buttonClass$1(b), tabIndex: 0, onClick: () => this.buttonClick(b) },
                    h("span", { class: 'alert-button-inner' }, b.text)))))
        ];
    }
    static get is() { return "ion-alert"; }
    static get host() { return { "theme": "alert" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "buttons": { "type": "Any", "attr": "buttons" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "dismiss": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "inputs": { "type": "Any", "attr": "inputs", "mutable": true }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "message": { "type": String, "attr": "message" }, "present": { "method": true }, "subTitle": { "type": String, "attr": "sub-title" }, "title": { "type": String, "attr": "title" }, "translucent": { "type": Boolean, "attr": "translucent" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionAlertDidLoad", "method": "ionAlertDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertDidPresent", "method": "ionAlertDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertWillPresent", "method": "ionAlertWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertWillDismiss", "method": "ionAlertWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertDidDismiss", "method": "ionAlertDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionAlertDidUnload", "method": "ionAlertDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-alert {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  contain: strict;\n  font-smoothing: antialiased;\n  -webkit-font-smoothing: antialiased;\n}\n\nion-alert.alert-top {\n  padding-top: 50px;\n  align-items: flex-start;\n}\n\n.alert-wrapper {\n  z-index: 10;\n  display: flex;\n  flex-direction: column;\n  min-width: 250px;\n  max-height: 90%;\n  opacity: 0;\n  contain: content;\n}\n\n.alert-title {\n  margin: 0;\n  padding: 0;\n}\n\n.alert-sub-title {\n  margin: 5px 0 0;\n  padding: 0;\n  font-weight: normal;\n}\n\n.alert-message {\n  box-sizing: border-box;\n  -webkit-overflow-scrolling: touch;\n  overflow-y: scroll;\n}\n\n.alert-input {\n  padding: 10px 0;\n  box-sizing: border-box;\n  width: 100%;\n  border: 0;\n  font: inherit;\n  background: inherit;\n}\n\n.alert-button-group {\n  display: flex;\n  flex-direction: row;\n  width: 100%;\n}\n\n.alert-button-group-vertical {\n  flex-direction: column;\n  flex-wrap: nowrap;\n}\n\n.alert-button {\n  margin: 0;\n  z-index: 0;\n  display: block;\n  border: 0;\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.alert-button-inner {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n\n.alert-tappable {\n  text-align: left;\n  text-align: start;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  border: 0;\n  font-size: inherit;\n  line-height: initial;\n  background: transparent;\n}\n\n.alert-button:active, .alert-button:focus,\n.alert-checkbox:active,\n.alert-checkbox:focus,\n.alert-input:active,\n.alert-input:focus,\n.alert-radio:active,\n.alert-radio:focus {\n  outline: none;\n}\n\n.alert-radio-icon,\n.alert-checkbox-icon,\n.alert-checkbox-inner {\n  box-sizing: border-box;\n}\n\n.alert-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  font-size: 14px;\n}\n\n.alert-md .alert-wrapper {\n  border-radius: 2px;\n  max-width: 280px;\n  background-color: var(--ion-overlay-md-background-color, var(--ion-overlay-background-color, #fafafa));\n  box-shadow: 0 16px 20px rgba(0, 0, 0, 0.4);\n}\n\n.alert-md .alert-head {\n  text-align: left;\n  text-align: start;\n  padding: 24px 24px 20px;\n}\n\n.alert-md .alert-title {\n  font-size: 22px;\n  font-weight: 500;\n}\n\n.alert-md .alert-sub-title {\n  font-size: 16px;\n}\n\n.alert-md .alert-message,\n.alert-md .alert-input-group {\n  padding: 0 24px 24px;\n  color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n}\n\n.alert-md .alert-message {\n  max-height: 240px;\n  font-size: 15px;\n}\n\n.alert-md .alert-message:empty {\n  padding: 0;\n}\n\n.alert-md .alert-input {\n  margin: 5px 0;\n  border-bottom: 1px solid var(--ion-border-md-color, var(--ion-border-color, #c1c4cd));\n  color: var(--ion-text-md-color, var(--ion-text-color, #000));\n}\n\n.alert-md .alert-input::-moz-placeholder {\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}\n\n.alert-md .alert-input:-ms-input-placeholder {\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}\n\n.alert-md .alert-input::-webkit-input-placeholder {\n  text-indent: 0;\n  color: var(--ion-placeholder-text-md-color, var(--ion-placeholder-text-color, #999));\n}\n\n.alert-md .alert-input:focus {\n  margin-bottom: 4px;\n  border-bottom: 2px solid var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.alert-md .alert-radio-group,\n.alert-md .alert-checkbox-group {\n  position: relative;\n  overflow: auto;\n  max-height: 240px;\n  border-top: 1px solid var(--ion-border-md-color, var(--ion-border-color, #c1c4cd));\n  border-bottom: 1px solid var(--ion-border-md-color, var(--ion-border-color, #c1c4cd));\n}\n\n.alert-md .alert-tappable {\n  position: relative;\n  display: flex;\n  overflow: hidden;\n  height: 44px;\n  contain: strict;\n}\n\n.alert-md .alert-radio-label {\n  padding: 13px 26px;\n  overflow: hidden;\n  flex: 1;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--ion-text-md-color, var(--ion-text-color, #000));\n}\n\n.alert-md .alert-radio-icon {\n  left: 13px;\n  top: 0;\n  border-radius: 50%;\n  position: relative;\n  display: block;\n  width: 16px;\n  height: 16px;\n  border-width: 2px;\n  border-style: solid;\n  border-color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n}\n\n.alert-md .alert-radio-inner {\n  left: 2px;\n  top: 2px;\n  border-radius: 50%;\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  transform: scale3d(0, 0, 0);\n  transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.alert-md [aria-checked=true] .alert-radio-label {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.alert-md [aria-checked=true] .alert-radio-icon {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.alert-md [aria-checked=true] .alert-radio-inner {\n  transform: scale3d(1, 1, 1);\n}\n\n.alert-md .alert-checkbox-label {\n  padding: 13px 26px;\n  overflow: hidden;\n  flex: 1;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--ion-text-md-color, var(--ion-text-color, #000));\n}\n\n.alert-md .alert-checkbox-icon {\n  left: 13px;\n  top: 0;\n  border-radius: 2px;\n  position: relative;\n  width: 16px;\n  height: 16px;\n  border-width: 2px;\n  border-style: solid;\n  border-color: var(--ion-border-md-color, var(--ion-border-color, #c1c4cd));\n  contain: strict;\n}\n\n.alert-md [aria-checked=true] .alert-checkbox-icon {\n  border-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.alert-md [aria-checked=true] .alert-checkbox-inner {\n  left: 3px;\n  top: 0;\n  position: absolute;\n  width: 6px;\n  height: 10px;\n  border-width: 2px;\n  border-top-width: 0;\n  border-left-width: 0;\n  border-style: solid;\n  border-color: var(--ion-color-md-primary-contrast, var(--ion-color-primary-contrast, #fff));\n  transform: rotate(45deg);\n}\n\n.alert-md .alert-button-group {\n  padding: 8px 8px 8px 24px;\n  box-sizing: border-box;\n  flex-wrap: wrap-reverse;\n  justify-content: flex-end;\n}\n\n.alert-md .alert-button {\n  border-radius: 2px;\n  margin: 0 8px 0 0;\n  padding: 10px;\n  text-align: right;\n  text-align: end;\n  position: relative;\n  overflow: hidden;\n  font-weight: 500;\n  text-transform: uppercase;\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n  background-color: transparent;\n}\n\n.alert-md .alert-button.activated {\n  background-color: var(--ion-background-md-color-step-400, var(--ion-background-color-step-400, #999999));\n}\n\n.alert-md .alert-button-inner {\n  justify-content: flex-end;\n}"; }
    static get styleMode() { return "md"; }
}
function buttonClass$1(button) {
    return Object.assign({ 'alert-button': true }, getClassMap(button.cssClass));
}

let ids$1 = 0;
const alerts = new Map();
class AlertController {
    create(opts) {
        // create ionic's wrapping ion-alert component
        const alertElement = document.createElement('ion-alert');
        // give this alert a unique id
        alertElement.alertId = ids$1++;
        // convert the passed in alert options into props
        // that get passed down into the new alert
        Object.assign(alertElement, opts);
        // append the alert element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(alertElement);
        return alertElement.componentOnReady();
    }
    dismiss(data, role, alertId = -1) {
        alertId = alertId >= 0 ? alertId : getHighestId$1();
        const alert = alerts.get(alertId);
        if (!alert) {
            return Promise.reject('alert does not exist');
        }
        return alert.dismiss(data, role);
    }
    getTop() {
        return alerts.get(getHighestId$1());
    }
    alertWillPresent(ev) {
        alerts.set(ev.target.alertId, ev.target);
    }
    alertWillDismiss(ev) {
        alerts.delete(ev.target.alertId);
    }
    escapeKeyUp() {
        removeLastAlert();
    }
    static get is() { return "ion-alert-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId$1() {
    let minimum = -1;
    alerts.forEach((_alert, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastAlert() {
    const toRemove = alerts.get(getHighestId$1());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

/**
 * iOS Popover Enter Animation
 */
function iosEnterAnimation$2(Animation, baseEl, ev) {
    let originY = 'top';
    let originX = 'left';
    const contentEl = baseEl.querySelector('.popover-content');
    const contentDimentions = contentEl.getBoundingClientRect();
    const contentWidth = contentDimentions.width;
    const contentHeight = contentDimentions.height;
    const bodyWidth = window.innerWidth;
    const bodyHeight = window.innerHeight;
    // If ev was passed, use that for target element
    const targetDim = ev && ev.target && ev.target.getBoundingClientRect();
    const targetTop = targetDim && 'top' in targetDim
        ? targetDim.top
        : bodyHeight / 2 - contentHeight / 2;
    const targetLeft = targetDim && 'left' in targetDim ? targetDim.left : bodyWidth / 2;
    const targetWidth = (targetDim && targetDim.width) || 0;
    const targetHeight = (targetDim && targetDim.height) || 0;
    const arrowEl = baseEl.querySelector('.popover-arrow');
    const arrowDim = arrowEl.getBoundingClientRect();
    const arrowWidth = arrowDim.width;
    const arrowHeight = arrowDim.height;
    if (!targetDim) {
        arrowEl.style.display = 'none';
    }
    const arrowCSS = {
        top: targetTop + targetHeight,
        left: targetLeft + targetWidth / 2 - arrowWidth / 2
    };
    const popoverCSS = {
        top: targetTop + targetHeight + (arrowHeight - 1),
        left: targetLeft + targetWidth / 2 - contentWidth / 2
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
    if (popoverCSS.left < POPOVER_IOS_BODY_PADDING + 25) {
        checkSafeAreaLeft = true;
        popoverCSS.left = POPOVER_IOS_BODY_PADDING;
    }
    else if (contentWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left + 25 >
        bodyWidth) {
        // Ok, so we're on the right side of the screen,
        // but now we need to make sure we're still a bit further right
        // cus....notchurally... Again, 25 is random. It works tho
        checkSafeAreaRight = true;
        popoverCSS.left = bodyWidth - contentWidth - POPOVER_IOS_BODY_PADDING;
        originX = 'right';
    }
    // make it pop up if there's room above
    if (targetTop + targetHeight + contentHeight > bodyHeight &&
        targetTop - contentHeight > 0) {
        arrowCSS.top = targetTop - (arrowHeight + 1);
        popoverCSS.top = targetTop - contentHeight - (arrowHeight - 1);
        baseEl.className = baseEl.className + ' popover-bottom';
        originY = 'bottom';
        // If there isn't room for it to pop up above the target cut it off
    }
    else if (targetTop + targetHeight + contentHeight > bodyHeight) {
        contentEl.style.bottom = POPOVER_IOS_BODY_PADDING + '%';
    }
    arrowEl.style.top = arrowCSS.top + 'px';
    arrowEl.style.left = arrowCSS.left + 'px';
    contentEl.style.top = popoverCSS.top + 'px';
    contentEl.style.left = popoverCSS.left + 'px';
    if (checkSafeAreaLeft) {
        if (CSS.supports('left', 'constant(safe-area-inset-left)')) {
            contentEl.style.left = `calc(${popoverCSS.left}px + constant(safe-area-inset-left)`;
        }
        else if (CSS.supports('left', 'env(safe-area-inset-left)')) {
            contentEl.style.left = `calc(${popoverCSS.left}px + env(safe-area-inset-left)`;
        }
    }
    if (checkSafeAreaRight) {
        if (CSS.supports('right', 'constant(safe-area-inset-right)')) {
            contentEl.style.left = `calc(${popoverCSS.left}px - constant(safe-area-inset-right)`;
        }
        else if (CSS.supports('right', 'env(safe-area-inset-right)')) {
            contentEl.style.left = `calc(${popoverCSS.left}px - env(safe-area-inset-right)`;
        }
    }
    contentEl.style.transformOrigin = originY + ' ' + originX;
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.popover-backdrop'));
    backdropAnimation.fromTo('opacity', 0.01, 0.08);
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.01, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease')
        .duration(100)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}
const POPOVER_IOS_BODY_PADDING = 5;

/**
 * iOS Popover Leave Animation
 */
function iosLeaveAnimation$2(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.popover-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.99, 0);
    backdropAnimation.fromTo('opacity', 0.08, 0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease')
        .duration(500)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

/**
 * Md Popover Enter Animation
 */
function mdEnterAnimation$2(Animation, baseEl, ev) {
    let originY = 'top';
    let originX = 'left';
    const contentEl = baseEl.querySelector('.popover-content');
    const contentDimentions = contentEl.getBoundingClientRect();
    const contentWidth = contentDimentions.width;
    const contentHeight = contentDimentions.height;
    const bodyWidth = window.innerWidth;
    const bodyHeight = window.innerHeight;
    // If ev was passed, use that for target element
    const targetDim = ev && ev.target && ev.target.getBoundingClientRect();
    const targetTop = targetDim && 'top' in targetDim
        ? targetDim.top
        : bodyHeight / 2 - contentHeight / 2;
    const targetLeft = targetDim && 'left' in targetDim
        ? targetDim.left
        : bodyWidth / 2 - contentWidth / 2;
    const targetHeight = (targetDim && targetDim.height) || 0;
    const popoverCSS = {
        top: targetTop,
        left: targetLeft
    };
    // If the popover left is less than the padding it is off screen
    // to the left so adjust it, else if the width of the popover
    // exceeds the body width it is off screen to the right so adjust
    if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
        popoverCSS.left = POPOVER_MD_BODY_PADDING;
    }
    else if (contentWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left >
        bodyWidth) {
        popoverCSS.left = bodyWidth - contentWidth - POPOVER_MD_BODY_PADDING;
        originX = 'right';
    }
    // If the popover when popped down stretches past bottom of screen,
    // make it pop up if there's room above
    if (targetTop + targetHeight + contentHeight > bodyHeight &&
        targetTop - contentHeight > 0) {
        popoverCSS.top = targetTop - contentHeight;
        baseEl.className = baseEl.className + ' popover-bottom';
        originY = 'bottom';
        // If there isn't room for it to pop up above the target cut it off
    }
    else if (targetTop + targetHeight + contentHeight > bodyHeight) {
        contentEl.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
    }
    contentEl.style.top = popoverCSS.top + 'px';
    contentEl.style.left = popoverCSS.left + 'px';
    contentEl.style.transformOrigin = originY + ' ' + originX;
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.popover-backdrop'));
    backdropAnimation.fromTo('opacity', 0.01, 0.08);
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.01, 1);
    const contentAnimation = new Animation();
    contentAnimation.addElement(baseEl.querySelector('.popover-content'));
    contentAnimation.fromTo('scale', 0.001, 1);
    const viewportAnimation = new Animation();
    viewportAnimation.addElement(baseEl.querySelector('.popover-viewport'));
    viewportAnimation.fromTo('opacity', 0.01, 1);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(300)
        .add(backdropAnimation)
        .add(wrapperAnimation)
        .add(contentAnimation)
        .add(viewportAnimation));
}
const POPOVER_MD_BODY_PADDING = 12;

/**
 * Md Popover Leave Animation
 */
function mdLeaveAnimation$2(Animation, baseEl) {
    const baseAnimation = new Animation();
    const backdropAnimation = new Animation();
    backdropAnimation.addElement(baseEl.querySelector('.popover-backdrop'));
    const wrapperAnimation = new Animation();
    wrapperAnimation.addElement(baseEl.querySelector('.popover-wrapper'));
    wrapperAnimation.fromTo('opacity', 0.99, 0);
    backdropAnimation.fromTo('opacity', 0.08, 0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease')
        .duration(500)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}

class Popover {
    constructor() {
        this.data = {};
        /**
         * If true, the popover will be dismissed when the backdrop is clicked. Defaults to `true`.
         */
        this.enableBackdropDismiss = true;
        /**
         * If true, a backdrop will be displayed behind the popover. Defaults to `true`.
         */
        this.showBackdrop = true;
        /**
         * If true, the popover will be translucent. Defaults to `false`.
         */
        this.translucent = false;
        /**
         * If true, the popover will animate. Defaults to `true`.
         */
        this.willAnimate = true;
    }
    /**
     * Present the popover overlay after it has been created.
     */
    present() {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionPopoverWillPresent.emit();
        this.el.style.zIndex = `${10000 + this.popoverId}`;
        // get the user's animation fn if one was provided
        const animationBuilder = this.enterAnimation || this.config.get('popoverEnter', this.mode === 'ios' ? iosEnterAnimation$2 : mdEnterAnimation$2);
        const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_POPOVER_CONTAINER_CLASS}`);
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
        return this.delegate.attachViewToDom(userComponentParent, this.component, this.data, cssClasses)
            .then((mountingData) => {
            this.usersComponentElement = mountingData.element;
            return domControllerAsync(this.dom.raf)
                .then(() => this.animationCtrl.create(animationBuilder, this.el, this.ev));
        })
            .then((animation) => {
            this.animation = animation;
            if (!this.willAnimate)
                this.animation = animation.duration(0);
            return playAnimationAsync(animation);
        })
            .then((animation) => {
            animation.destroy();
            this.componentDidEnter();
        });
    }
    /**
     * Dismiss the popover overlay after it has been presented.
     */
    dismiss(data, role) {
        if (this.animation) {
            this.animation.destroy();
            this.animation = null;
        }
        this.ionPopoverWillDismiss.emit({ data, role });
        if (!this.delegate) {
            this.delegate = new DomFrameworkDelegate();
        }
        const animationBuilder = this.leaveAnimation || this.config.get('popoverLeave', this.mode === 'ios' ? iosLeaveAnimation$2 : mdLeaveAnimation$2);
        return this.animationCtrl.create(animationBuilder, this.el)
            .then(animation => {
            this.animation = animation;
            return playAnimationAsync(animation);
        })
            .then((animation) => {
            animation.destroy();
            this.ionPopoverDidDismiss.emit({ data, role });
        })
            .then(() => {
            return domControllerAsync(this.dom.write, () => {
                const userComponentParent = this.el.querySelector(`.${USER_COMPONENT_POPOVER_CONTAINER_CLASS}`);
                this.delegate.removeViewFromDom(userComponentParent, this.usersComponentElement);
                this.el.parentNode.removeChild(this.el);
            });
        });
    }
    componentDidLoad() {
        this.ionPopoverDidLoad.emit();
    }
    componentDidEnter() {
        this.ionPopoverDidPresent.emit();
    }
    componentDidUnload() {
        this.ionPopoverDidUnload.emit();
    }
    onDismiss(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.dismiss();
    }
    backdropClick() {
        if (this.enableBackdropDismiss) {
            // const opts: NavOptions = {
            //   minClickBlockDuration: 400
            // };
            this.dismiss();
        }
    }
    hostData() {
        const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'popover-translucent') : {};
        const hostClasses = Object.assign({}, themedClasses);
        return {
            class: hostClasses
        };
    }
    render() {
        const backdropClasses = createThemedClasses(this.mode, this.color, 'popover-backdrop'), wrapperClasses = createThemedClasses(this.mode, this.color, 'popover-wrapper');
        return [
            h("ion-backdrop", { onClick: this.backdropClick.bind(this), class: Object.assign({}, backdropClasses) }),
            h("div", { class: wrapperClasses },
                h("div", { class: 'popover-arrow' }),
                h("div", { class: 'popover-content' },
                    h("div", { class: USER_COMPONENT_POPOVER_CONTAINER_CLASS })))
        ];
    }
    static get is() { return "ion-popover"; }
    static get host() { return { "theme": "popover" }; }
    static get properties() { return { "animationCtrl": { "connect": "ion-animation-controller" }, "color": { "type": String, "attr": "color" }, "component": { "type": String, "attr": "component" }, "config": { "context": "config" }, "cssClass": { "type": String, "attr": "css-class" }, "data": { "type": "Any", "attr": "data" }, "delegate": { "type": "Any", "attr": "delegate", "mutable": true }, "dismiss": { "method": true }, "dom": { "context": "dom" }, "el": { "elementRef": true }, "enableBackdropDismiss": { "type": Boolean, "attr": "enable-backdrop-dismiss" }, "enterAnimation": { "type": "Any", "attr": "enter-animation" }, "ev": { "type": "Any", "attr": "ev" }, "leaveAnimation": { "type": "Any", "attr": "leave-animation" }, "mode": { "type": "Any", "attr": "mode" }, "popoverId": { "type": Number, "attr": "popover-id" }, "present": { "method": true }, "showBackdrop": { "type": Boolean, "attr": "show-backdrop" }, "translucent": { "type": Boolean, "attr": "translucent" }, "willAnimate": { "type": Boolean, "attr": "will-animate" } }; }
    static get events() { return [{ "name": "ionPopoverDidLoad", "method": "ionPopoverDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPopoverDidPresent", "method": "ionPopoverDidPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPopoverWillPresent", "method": "ionPopoverWillPresent", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPopoverWillDismiss", "method": "ionPopoverWillDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPopoverDidDismiss", "method": "ionPopoverDidDismiss", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionPopoverDidUnload", "method": "ionPopoverDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-popover {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.popover-wrapper {\n  z-index: 10;\n  opacity: 0;\n}\n\n.popover-content {\n  position: absolute;\n  z-index: 10;\n  display: flex;\n  overflow: auto;\n  flex-direction: column;\n}\n\n.popover-content ion-content,\n.popover-content ion-scroll {\n  contain: none;\n}\n\n.popover-content ion-scroll {\n  position: relative;\n}\n\nion-popover-controller {\n  display: none;\n}\n\n.popover-backdrop {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 2;\n  display: block;\n  width: 100%;\n  height: 100%;\n  opacity: .01;\n  transform: translateZ(0);\n}\n\n.popover-backdrop.backdrop-no-tappable {\n  cursor: auto;\n}\n\n.popover-backdrop-md {\n  background-color: var(--ion-backdrop-md-color, var(--ion-backdrop-color, #000));\n}\n\n.popover-md .popover-content {\n  border-radius: 2px;\n  transform-origin: left top;\n  width: 250px;\n  min-width: 0;\n  min-height: 0;\n  max-height: 90%;\n  color: var(--ion-text-md-color, var(--ion-text-color, #000));\n  background: var(--ion-background-md-color, var(--ion-background-color, #fff));\n  box-shadow: 0 3px 12px 2px rgba(0, 0, 0, 0.3);\n}\n\n.popover-md .popover-viewport {\n  transition-delay: 100ms;\n}"; }
    static get styleMode() { return "md"; }
}

const USER_COMPONENT_POPOVER_CONTAINER_CLASS = 'popover-viewport';

let ids$2 = 0;
const popovers = new Map();
class PopoverController {
    create(opts) {
        // create ionic's wrapping ion-popover component
        const popoverElement = document.createElement('ion-popover');
        // give this popover a unique id
        popoverElement.popoverId = ids$2++;
        // convert the passed in popover options into props
        // that get passed down into the new popover
        Object.assign(popoverElement, opts);
        // append the popover element to the document body
        const appRoot = document.querySelector('ion-app') || document.body;
        appRoot.appendChild(popoverElement);
        return popoverElement.componentOnReady();
    }
    dismiss(data, role, popoverId = -1) {
        popoverId = popoverId >= 0 ? popoverId : getHighestId$2();
        const popover = popovers.get(popoverId);
        if (!popover) {
            return Promise.reject('popover does not exist');
        }
        return popover.dismiss(data, role);
    }
    getTop() {
        return popovers.get(getHighestId$2());
    }
    popoverWillPresent(ev) {
        popovers.set(ev.target.popoverId, ev.target);
    }
    popoverWillDismiss(ev) {
        popovers.delete(ev.target.popoverId);
    }
    escapeKeyUp() {
        removeLastPopover();
    }
    static get is() { return "ion-popover-controller"; }
    static get properties() { return { "create": { "method": true }, "dismiss": { "method": true }, "getTop": { "method": true } }; }
}
function getHighestId$2() {
    let minimum = -1;
    popovers.forEach((_popover, id) => {
        if (id > minimum) {
            minimum = id;
        }
    });
    return minimum;
}
function removeLastPopover() {
    const toRemove = popovers.get(getHighestId$2());
    return toRemove ? toRemove.dismiss() : Promise.resolve();
}

class Select {
    constructor() {
        this.childOpts = [];
        this.isExpanded = false;
        /**
         * If true, the user cannot interact with the select. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * The text to display on the cancel button. Default: `Cancel`.
         */
        this.cancelText = 'Cancel';
        /**
         * The text to display on the ok button. Default: `OK`.
         */
        this.okText = 'OK';
        /**
         * The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
         */
        this.interface = 'alert';
        /**
         * Any additional options that the `alert`, `action-sheet` or `popover` interface
         * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
         * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
         * [PopoverController API docs](../../popover/PopoverController/#create) for the
         * create options for each interface.
         */
        this.interfaceOptions = {};
        this.selectId = 'ion-sel-' + (selectIds++);
    }
    disabledChanged() {
        this.emitStyle();
    }
    valueChanged() {
        // this select value just changed
        // double check the select option with this value is checked
        if (this.value === undefined) {
            // set to undefined
            // ensure all that are checked become unchecked
            this.childOpts.filter(o => o.selected).forEach(selectOption => {
                selectOption.selected = false;
            });
            this.text = '';
        }
        else {
            let hasChecked = false;
            const texts = [];
            this.childOpts.forEach(selectOption => {
                if ((Array.isArray(this.value) && this.value.indexOf(selectOption.value) > -1) || (selectOption.value === this.value)) {
                    if (!selectOption.selected && (this.multiple || !hasChecked)) {
                        // correct value for this select option
                        // but this select option isn't checked yet
                        // and we haven't found a checked yet
                        // so CHECK IT!
                        selectOption.selected = true;
                    }
                    else if (!this.multiple && hasChecked && selectOption.selected) {
                        // somehow we've got multiple select options
                        // with the same value, but only one can be checked
                        selectOption.selected = false;
                    }
                    // remember we've got a checked select option button now
                    hasChecked = true;
                }
                else if (selectOption.selected) {
                    // this select option doesn't have the correct value
                    // and it's also checked, so let's uncheck it
                    selectOption.selected = false;
                }
                if (selectOption.selected) {
                    texts.push(selectOption.textContent);
                }
            });
            this.text = texts.join(', ');
        }
        // emit the new value
        this.ionChange.emit({
            value: this.value,
            text: this.text
        });
        this.emitStyle();
    }
    optLoad(ev) {
        const selectOption = ev.target;
        this.childOpts.push(selectOption);
        if (this.value !== undefined && (Array.isArray(this.value) && this.value.indexOf(selectOption.value) > -1) || (selectOption.value === this.value)) {
            // this select has a value and this
            // option equals the correct select value
            // so let's check this select option
            selectOption.selected = true;
        }
        else if (Array.isArray(this.value) && this.multiple && selectOption.selected) {
            // if the value is an array we need to push the option on
            this.value.push(selectOption.value);
        }
        else if (this.value === undefined && selectOption.selected) {
            // this select does not have a value
            // but this select option is checked, so let's set the
            // select's value from the checked select option
            this.value = selectOption.value;
        }
        else if (selectOption.selected) {
            // if it doesn't match one of the above cases, but the
            // select option is still checked, then we need to uncheck it
            selectOption.selected = false;
        }
    }
    optUnload(ev) {
        const index = this.childOpts.indexOf(ev.target);
        if (index > -1) {
            this.childOpts.splice(index, 1);
        }
    }
    onSelect(ev) {
        // ionSelect only come from the checked select option
        this.childOpts.forEach(selectOption => {
            if (selectOption === ev.target) {
                this.value = selectOption.value;
            }
            else {
                selectOption.selected = false;
            }
        });
    }
    componentWillLoad() {
        if (!this.value) {
            this.value = this.multiple ? [] : undefined;
        }
        this.name = this.name || this.selectId;
    }
    componentDidLoad() {
        const label = this.getLabel();
        if (label) {
            this.labelId = label.id = this.name + '-lbl';
        }
        if (this.multiple) {
            // there are no values set at this point
            // so check to see who should be selected
            const checked = this.childOpts.filter(o => o.selected);
            this.value.length = 0;
            checked.forEach(o => {
                // doing this instead of map() so we don't
                // fire off an unecessary change event
                this.value.push(o.value);
            });
            this.text = checked.map(o => o.textContent).join(', ');
        }
        else {
            const checked = this.childOpts.find(o => o.selected);
            if (checked) {
                this.value = checked.value;
                this.text = checked.textContent;
            }
        }
        this.emitStyle();
    }
    getLabel() {
        const item = this.el.closest('ion-item');
        if (item) {
            return item.querySelector('ion-label');
        }
        return null;
    }
    open(ev) {
        let selectInterface = this.interface;
        if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
            console.warn('Select interface cannot be "' + selectInterface + '" with a multi-value select. Using the "alert" interface instead.');
            selectInterface = 'alert';
        }
        if (selectInterface === 'popover' && !ev) {
            console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
            selectInterface = 'alert';
        }
        if (selectInterface === 'popover') {
            return this.openPopover(ev);
        }
        if (selectInterface === 'action-sheet') {
            return this.openActionSheet();
        }
        return this.openAlert();
    }
    openPopover(ev) {
        const interfaceOptions = Object.assign({}, this.interfaceOptions);
        const popoverOpts = Object.assign(interfaceOptions, {
            component: 'ion-select-popover',
            data: {
                title: interfaceOptions.title,
                subTitle: interfaceOptions.subTitle,
                message: interfaceOptions.message,
                value: this.value,
                options: this.childOpts.map(o => {
                    return {
                        text: o.textContent,
                        value: o.value,
                        checked: o.selected,
                        disabled: o.disabled,
                        handler: () => {
                            this.value = o.value;
                            this.close();
                        }
                    };
                })
            },
            cssClass: 'select-popover' + (interfaceOptions.cssClass ? ' ' + interfaceOptions.cssClass : ''),
            ev: ev
        });
        const popover = this.popoverCtrl.create(popoverOpts);
        return popover.then(overlay => {
            this.overlay = overlay;
            return overlay.present().then(() => {
                this.isExpanded = true;
                return overlay;
            });
        });
    }
    openActionSheet() {
        const interfaceOptions = Object.assign({}, this.interfaceOptions);
        const actionSheetButtons = this.childOpts.map(option => {
            return {
                role: (option.selected ? 'selected' : ''),
                text: option.textContent,
                handler: () => {
                    this.value = option.value;
                }
            };
        });
        actionSheetButtons.push({
            text: this.cancelText,
            role: 'cancel',
            handler: () => {
                this.ionCancel.emit(this);
            }
        });
        const actionSheetOpts = Object.assign(interfaceOptions, {
            buttons: actionSheetButtons,
            cssClass: 'select-action-sheet' + (interfaceOptions.cssClass ? ' ' + interfaceOptions.cssClass : '')
        });
        const actionSheet = this.actionSheetCtrl.create(actionSheetOpts);
        return actionSheet.then(overlay => {
            this.overlay = overlay;
            return overlay.present().then(() => {
                this.isExpanded = true;
                return overlay;
            });
        });
    }
    openAlert() {
        const interfaceOptions = Object.assign({}, this.interfaceOptions);
        const label = this.getLabel();
        const labelText = (label) ? label.textContent : null;
        const alertOpts = Object.assign(interfaceOptions, {
            title: interfaceOptions.title ? interfaceOptions.title : labelText,
            inputs: this.childOpts.map(o => {
                return {
                    type: (this.multiple ? 'checkbox' : 'radio'),
                    label: o.textContent,
                    value: o.value,
                    checked: o.selected,
                    disabled: o.disabled
                };
            }),
            buttons: [
                {
                    text: this.cancelText,
                    role: 'cancel',
                    handler: () => {
                        this.ionCancel.emit(this);
                    }
                },
                {
                    text: this.okText,
                    handler: (selectedValues) => {
                        this.value = selectedValues;
                    }
                }
            ],
            cssClass: 'select-alert ' +
                (this.multiple ? 'multiple-select-alert' : 'single-select-alert') +
                (interfaceOptions.cssClass ? ' ' + interfaceOptions.cssClass : '')
        });
        const alert = this.alertCtrl.create(alertOpts);
        return alert.then(overlay => {
            this.overlay = overlay;
            return overlay.present().then(() => {
                this.isExpanded = true;
                return overlay;
            });
        });
    }
    /**
     * Close the select interface.
     */
    close() {
        // TODO check !this.overlay || !this.isFocus()
        if (!this.overlay) {
            return Promise.resolve();
        }
        const overlay = this.overlay;
        this.overlay = null;
        this.isExpanded = false;
        return overlay.dismiss();
    }
    onKeyUp() {
        this.keyFocus = true;
    }
    onFocus() {
        this.ionFocus.emit();
    }
    onBlur() {
        this.keyFocus = false;
        this.ionBlur.emit();
    }
    hasValue() {
        if (Array.isArray(this.value)) {
            return this.value.length > 0;
        }
        return (this.value !== null && this.value !== undefined && this.value !== '');
    }
    emitStyle() {
        clearTimeout(this.styleTmr);
        this.styleTmr = setTimeout(() => {
            this.ionStyle.emit({
                'select': true,
                'select-disabled': this.disabled,
                'input-has-value': this.hasValue()
            });
        });
    }
    hostData() {
        return {
            class: {
                'select-disabled': this.disabled,
                'select-key': this.keyFocus
            }
        };
    }
    render() {
        let addPlaceholderClass = false;
        let selectText = this.selectedText || this.text;
        if (!selectText && this.placeholder) {
            selectText = this.placeholder;
            addPlaceholderClass = true;
        }
        const selectTextClasses = {
            'select-text': true,
            'select-placeholder': addPlaceholderClass
        };
        return [
            h("div", { role: 'textbox', "aria-multiline": 'false', class: selectTextClasses }, selectText),
            h("div", { class: 'select-icon', role: 'presentation' },
                h("div", { class: 'select-icon-inner' })),
            h("button", { type: 'button', role: 'combobox', "aria-haspopup": 'dialog', "aria-expanded": this.isExpanded, "aria-labelledby": this.labelId, "aria-disabled": this.disabled ? 'true' : false, onClick: this.open.bind(this), onKeyUp: this.onKeyUp.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), class: 'select-cover' },
                h("slot", null)),
            h("input", { type: 'hidden', name: this.name, value: this.value })
        ];
    }
    static get is() { return "ion-select"; }
    static get host() { return { "theme": "select" }; }
    static get properties() { return { "actionSheetCtrl": { "connect": "ion-action-sheet-controller" }, "alertCtrl": { "connect": "ion-alert-controller" }, "cancelText": { "type": String, "attr": "cancel-text" }, "disabled": { "type": Boolean, "attr": "disabled", "watchCallbacks": ["disabledChanged"] }, "el": { "elementRef": true }, "interface": { "type": String, "attr": "interface" }, "interfaceOptions": { "type": "Any", "attr": "interface-options" }, "isExpanded": { "state": true }, "keyFocus": { "state": true }, "multiple": { "type": Boolean, "attr": "multiple" }, "name": { "type": String, "attr": "name", "mutable": true }, "okText": { "type": String, "attr": "ok-text" }, "placeholder": { "type": String, "attr": "placeholder" }, "popoverCtrl": { "connect": "ion-popover-controller" }, "selectedText": { "type": String, "attr": "selected-text" }, "text": { "state": true }, "value": { "type": "Any", "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionCancel", "method": "ionCancel", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-select {\n  position: relative;\n  display: flex;\n  overflow: hidden;\n}\n\n.item .select {\n  position: static;\n  max-width: 45%;\n}\n\n.select-cover {\n  left: 0;\n  top: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n}\n\n.select-text {\n  overflow: hidden;\n  flex: 1;\n  min-width: 16px;\n  font-size: inherit;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.item-multiple-inputs ion-select {\n  position: relative;\n}\n\n.select-disabled,\n.item-select-disabled ion-label {\n  opacity: .4;\n  pointer-events: none;\n}\n\n.select-popover ion-list {\n  margin: -1px 0;\n}\n\n.select-option {\n  display: none;\n}\n\n.select button:focus {\n  outline: none;\n}\n\n.select-key button {\n  border: 2px solid #5e9ed6;\n}\n\n.item-label-stacked .select,\n.item-label-floating .select {\n  max-width: 100%;\n}\n\n.select-md {\n  padding: 13px 8px 13px 16px;\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  color: var(--ion-text-md-color, var(--ion-text-color, #000));\n}\n\n.select-md .select-placeholder {\n  color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n}\n\n.select-md .item-select ion-label {\n  margin-left: 0;\n}\n\n.select-md .select-icon {\n  position: relative;\n  width: 12px;\n  height: 19px;\n}\n\n.select-md .select-icon .select-icon-inner {\n  left: 5px;\n  top: 50%;\n  margin-top: -3px;\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-top: 5px solid;\n  border-right: 5px solid transparent;\n  border-left: 5px solid transparent;\n  color: var(--ion-text-md-color-step-600, var(--ion-text-color-step-600, #999999));\n  pointer-events: none;\n}\n\n.item-label-stacked .select-md,\n.item-label-floating .select-md {\n  padding-left: 0;\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n\n.select-popover-md .radio-icon {\n  display: none;\n}\n\n.select-popover-md .item-radio-checked {\n  background-color: var(--ion-background-md-color-step-150, var(--ion-background-color-step-150, #d9d9d9));\n}\n\n.select-popover-md .item-radio-checked ion-label {\n  color: initial;\n}"; }
    static get styleMode() { return "md"; }
}
let selectIds = 0;

export { ActionSheet as IonActionSheet, ActionSheetController as IonActionSheetController, Alert as IonAlert, AlertController as IonAlertController, Popover as IonPopover, PopoverController as IonPopoverController, Select as IonSelect };

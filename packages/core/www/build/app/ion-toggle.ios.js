/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

import { hapticSelection } from './chunk6.js';
import { debounce } from './chunk1.js';

class Toggle {
    constructor() {
        this.activated = false;
        /**
         * If true, the toggle is selected. Defaults to `false`.
         */
        this.checked = false;
        /*
         * If true, the user cannot interact with the toggle. Default false.
         */
        this.disabled = false;
        /**
         * the value of the toggle.
         */
        this.value = 'on';
        this.gestureConfig = {
            'onStart': this.onDragStart.bind(this),
            'onMove': this.onDragMove.bind(this),
            'onEnd': this.onDragEnd.bind(this),
            'gestureName': 'toggle',
            'gesturePriority': 30,
            'type': 'pan',
            'direction': 'x',
            'threshold': 0,
            'attachTo': 'parent'
        };
    }
    componentWillLoad() {
        this.ionStyle.emit = debounce(this.ionStyle.emit.bind(this.ionStyle));
        this.inputId = `ion-tg-${toggleIds++}`;
        if (this.name === undefined) {
            this.name = this.inputId;
        }
        this.emitStyle();
    }
    componentDidLoad() {
        this.didLoad = true;
        const parentItem = this.nativeInput.closest('ion-item');
        if (parentItem) {
            const itemLabel = parentItem.querySelector('ion-label');
            if (itemLabel) {
                itemLabel.id = this.inputId + '-lbl';
                this.nativeInput.setAttribute('aria-labelledby', itemLabel.id);
            }
        }
    }
    checkedChanged(isChecked) {
        if (this.didLoad) {
            this.ionChange.emit({
                checked: isChecked,
                value: this.value
            });
        }
        this.emitStyle();
    }
    emitStyle() {
        this.ionStyle.emit({
            'toggle-disabled': this.disabled,
            'toggle-checked': this.checked,
            'toggle-activated': this.activated
        });
    }
    onDragStart(detail) {
        this.pivotX = detail.currentX;
        this.activated = true;
    }
    onDragMove(detail) {
        const currentX = detail.currentX;
        if (shouldToggle(this.checked, currentX - this.pivotX, -15)) {
            this.checked = !this.checked;
            this.pivotX = currentX;
            hapticSelection();
        }
    }
    onDragEnd(detail) {
        const delta = detail.currentX - this.pivotX;
        if (shouldToggle(this.checked, delta, 4)) {
            this.checked = !this.checked;
            hapticSelection();
        }
        this.activated = false;
        this.nativeInput.focus();
    }
    onChange() {
        this.checked = !this.checked;
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
    hostData() {
        return {
            class: {
                'toggle-activated': this.activated,
                'toggle-checked': this.checked,
                'toggle-disabled': this.disabled,
                'toggle-key': this.keyFocus
            }
        };
    }
    render() {
        return [
            h("ion-gesture", Object.assign({}, this.gestureConfig, { disabled: this.disabled, tabIndex: -1 }),
                h("div", { class: 'toggle-icon' },
                    h("div", { class: 'toggle-inner' })),
                h("div", { class: 'toggle-cover' })),
            h("input", { type: 'checkbox', onChange: this.onChange.bind(this), onFocus: this.onFocus.bind(this), onBlur: this.onBlur.bind(this), onKeyUp: this.onKeyUp.bind(this), checked: this.checked, id: this.inputId, name: this.name, value: this.value, disabled: this.disabled, ref: r => this.nativeInput = r })
        ];
    }
    static get is() { return "ion-toggle"; }
    static get host() { return { "theme": "toggle" }; }
    static get properties() { return { "activated": { "state": true }, "checked": { "type": Boolean, "attr": "checked", "mutable": true, "watchCallbacks": ["checkedChanged"] }, "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled", "mutable": true, "watchCallbacks": ["emitStyle"] }, "keyFocus": { "state": true }, "mode": { "type": "Any", "attr": "mode" }, "name": { "type": String, "attr": "name", "mutable": true }, "value": { "type": String, "attr": "value" } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionFocus", "method": "ionFocus", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionBlur", "method": "ionBlur", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionStyle", "method": "ionStyle", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-toggle {\n  display: inline-block;\n  contain: content;\n}\n\nion-toggle ion-gesture {\n  display: block;\n  width: 100%;\n  height: 100%;\n  visibility: inherit;\n}\n\n.toggle-cover {\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  outline: none;\n  font-family: inherit;\n  font-style: inherit;\n  font-variant: inherit;\n  line-height: 1;\n  text-transform: none;\n  background: transparent;\n  cursor: pointer;\n}\n\nion-toggle input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  pointer-events: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nion-toggle :focus {\n  outline: none;\n}\n\n.toggle-key input {\n  border: 2px solid #5e9ed6;\n}\n\n.toggle-ios {\n  box-sizing: content-box;\n  position: relative;\n  width: 51px;\n  height: 32px;\n  contain: strict;\n}\n\n.toggle-ios .toggle-icon {\n  border-radius: 16px;\n  position: relative;\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: var(--ion-background-ios-color-step-50, var(--ion-background-color-step-50, #f2f2f2));\n  transition: background-color 300ms;\n  pointer-events: none;\n}\n\n.toggle-ios .toggle-icon::before {\n  left: 2px;\n  right: 2px;\n  top: 2px;\n  bottom: 2px;\n  border-radius: 16px;\n  position: absolute;\n  background-color: var(--ion-item-ios-background-color, var(--ion-background-ios-color, var(--ion-background-color, #fff)));\n  content: \"\";\n  transform: scale3d(1, 1, 1);\n  transition: transform 300ms;\n}\n\n.toggle-ios .toggle-inner {\n  left: 2px;\n  top: 2px;\n  border-radius: 14px;\n  position: absolute;\n  width: 28px;\n  height: 28px;\n  background-color: var(--ion-item-ios-background-color, var(--ion-background-ios-color, var(--ion-background-color, #fff)));\n  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.16), 0 3px 1px rgba(0, 0, 0, 0.1);\n  transition: transform 300ms, width 120ms ease-in-out 80ms, left 110ms ease-in-out 80ms, right 110ms ease-in-out 80ms;\n  will-change: transform;\n  contain: strict;\n}\n\n.toggle-ios.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.toggle-ios.toggle-activated .toggle-icon::before,\n.toggle-ios.toggle-checked .toggle-icon::before {\n  transform: scale3d(0, 0, 0);\n}\n\n.toggle-ios.toggle-checked .toggle-inner {\n  transform: translate3d(19px,  0,  0);\n}\n\n.toggle-ios.toggle-activated.toggle-checked .toggle-inner::before {\n  transform: scale3d(0, 0, 0);\n}\n\n.toggle-ios.toggle-activated .toggle-inner {\n  width: 34px;\n}\n\n.toggle-ios.toggle-activated.toggle-checked .toggle-inner {\n  left: -4px;\n}\n\n.toggle-ios.toggle-disabled,\n.item-ios.item-toggle-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.item-ios .toggle-ios[slot] {\n  margin: 0;\n  padding: 6px 8px 5px 16px;\n}\n\n.item-ios .toggle-ios[slot=\"start\"] {\n  padding: 6px 16px 5px 0;\n}\n\n.toggle-ios-primary.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.toggle-ios-secondary.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.toggle-ios-tertiary.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.toggle-ios-success.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.toggle-ios-warning.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.toggle-ios-danger.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.toggle-ios-light.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.toggle-ios-medium.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.toggle-ios-dark.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}
function shouldToggle(checked, deltaX, margin) {
    const isRTL = document.dir === 'rtl';
    if (checked) {
        return (!isRTL && (margin > deltaX)) ||
            (isRTL && (-margin < deltaX));
    }
    else {
        return (!isRTL && (-margin < deltaX)) ||
            (isRTL && (margin > deltaX));
    }
}
let toggleIds = 0;

export { Toggle as IonToggle };

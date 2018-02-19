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
    static get style() { return "ion-toggle {\n  display: inline-block;\n  contain: content;\n}\n\nion-toggle ion-gesture {\n  display: block;\n  width: 100%;\n  height: 100%;\n  visibility: inherit;\n}\n\n.toggle-cover {\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  outline: none;\n  font-family: inherit;\n  font-style: inherit;\n  font-variant: inherit;\n  line-height: 1;\n  text-transform: none;\n  background: transparent;\n  cursor: pointer;\n}\n\nion-toggle input {\n  left: 0;\n  top: 0;\n  margin: 0;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  cursor: pointer;\n  pointer-events: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n\nion-toggle :focus {\n  outline: none;\n}\n\n.toggle-key input {\n  border: 2px solid #5e9ed6;\n}\n\n.toggle-md {\n  padding: 12px;\n  box-sizing: content-box;\n  position: relative;\n  width: 36px;\n  height: 14px;\n  contain: strict;\n}\n\n.toggle-md .toggle-icon {\n  border-radius: 14px;\n  position: relative;\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: var(--ion-item-md-border-color, var(--ion-item-border-color, #dedede));\n  transition: background-color 300ms;\n  pointer-events: none;\n}\n\n.toggle-md .toggle-inner {\n  left: 0;\n  top: -3px;\n  border-radius: 50%;\n  position: absolute;\n  width: 20px;\n  height: 20px;\n  background-color: var(--ion-background-md-color, var(--ion-background-color, #fff));\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  transition-duration: 300ms;\n  transition-property: transform, background-color;\n  will-change: transform, background-color;\n  contain: strict;\n}\n\n.toggle-md.toggle-checked .toggle-icon {\n  background-color: rgba(var(--ion-color-md-primary-rgb, var(--ion-color-primary-rgb, 72, 138, 255)), var(--ion-alpha-md-medium, var(--ion-alpha-medium, 0.4)));\n}\n\n.toggle-md.toggle-checked .toggle-inner {\n  transform: translate3d(16px,  0,  0);\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.toggle-md.toggle-disabled,\n.item-md.item-toggle-disabled ion-label {\n  opacity: 0.3;\n  pointer-events: none;\n}\n\n.toggle-md.toggle-disabled ion-radio {\n  opacity: 0.3;\n}\n\n.item-md .toggle-md[slot] {\n  margin: 0;\n  padding: 12px 8px 12px 16px;\n  cursor: pointer;\n}\n\n.item-md .toggle-md[slot=\"start\"] {\n  padding: 12px 18px 12px 2px;\n}\n\n.item-md.item-toggle ion-label {\n  margin-left: 0;\n}\n\n.toggle-md-primary.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-primary-tint, var(--ion-color-primary-tint, #5a96ff));\n}\n\n.toggle-md-primary.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.toggle-md-secondary.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-secondary-tint, var(--ion-color-secondary-tint, #47df74));\n}\n\n.toggle-md-secondary.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.toggle-md-tertiary.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-tertiary-tint, var(--ion-color-tertiary-tint, #f5b255));\n}\n\n.toggle-md-tertiary.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.toggle-md-success.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-success-tint, var(--ion-color-success-tint, #28e070));\n}\n\n.toggle-md-success.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.toggle-md-warning.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-warning-tint, var(--ion-color-warning-tint, #ffd31a));\n}\n\n.toggle-md-warning.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.toggle-md-danger.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-danger-tint, var(--ion-color-danger-tint, #f65050));\n}\n\n.toggle-md-danger.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.toggle-md-light.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-light-tint, var(--ion-color-light-tint, whitesmoke));\n}\n\n.toggle-md-light.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.toggle-md-medium.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-medium-tint, var(--ion-color-medium-tint, #a2a4ab));\n}\n\n.toggle-md-medium.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.toggle-md-dark.toggle-checked .toggle-icon {\n  background-color: var(--ion-color-md-dark-tint, var(--ion-color-dark-tint, #383838));\n}\n\n.toggle-md-dark.toggle-checked .toggle-inner {\n  background-color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
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

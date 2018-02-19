/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class SelectOption {
    constructor() {
        /**
         * If true, the user cannot interact with the select option. Defaults to `false`.
         */
        this.disabled = false;
        /**
         * If true, the element is selected.
         */
        this.selected = false;
        this.id = 'ion-selopt-' + (selectOptionIds++);
    }
    componentWillLoad() {
        this.value = this.value || this.el.textContent;
    }
    componentDidLoad() {
        this.ionSelectOptionDidLoad.emit();
    }
    componentDidUnload() {
        this.ionSelectOptionDidUnload.emit();
    }
    hostData() {
        return {
            'role': 'option',
            'id': this.id
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-select-option"; }
    static get host() { return { "theme": "select-option" }; }
    static get properties() { return { "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "selected": { "type": Boolean, "attr": "selected", "mutable": true }, "value": { "type": String, "attr": "value", "mutable": true } }; }
    static get events() { return [{ "name": "ionSelectOptionDidLoad", "method": "ionSelectOptionDidLoad", "bubbles": true, "cancelable": true, "composed": true }, { "name": "ionSelectOptionDidUnload", "method": "ionSelectOptionDidUnload", "bubbles": true, "cancelable": true, "composed": true }]; }
}
let selectOptionIds = 0;

export { SelectOption as IonSelectOption };

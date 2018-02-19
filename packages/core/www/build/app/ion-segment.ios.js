/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Segment {
    constructor() {
        /*
         * If true, the user cannot interact with the segment. Defaults to `false`.
         */
        this.disabled = false;
    }
    valueChanged(val) {
        this.selectButton(val);
        this.ionChange.emit();
    }
    componentDidLoad() {
        this.selectButton(this.value);
    }
    segmentClick(ev) {
        const selectedButton = ev.target;
        this.value = selectedButton.value;
    }
    selectButton(val) {
        const buttons = this.el.querySelectorAll('ion-segment-button');
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            button.activated = (button.value === val);
            // If there is no value set on the segment and a button
            // is checked we should activate it
            if (!val && button.checked) {
                button.activated = button.checked;
            }
        }
    }
    hostData() {
        return {
            class: {
                'segment-disabled': this.disabled
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-segment"; }
    static get host() { return { "theme": "segment" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "disabled": { "type": Boolean, "attr": "disabled" }, "el": { "elementRef": true }, "mode": { "type": "Any", "attr": "mode" }, "value": { "type": String, "attr": "value", "mutable": true, "watchCallbacks": ["valueChanged"] } }; }
    static get events() { return [{ "name": "ionChange", "method": "ionChange", "bubbles": true, "cancelable": true, "composed": true }]; }
    static get style() { return "ion-segment {\n  display: flex;\n  flex: 1;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  font-smoothing: antialiased;\n  -webkit-font-smoothing: antialiased;\n}\n\n.segment-ios {\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n}\n\n.segment-ios.segment-disabled {\n  opacity: 0.4;\n  pointer-events: none;\n}\n\n.toolbar-ios .segment-ios {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  position: absolute;\n}"; }
    static get styleMode() { return "ios"; }
}

export { Segment as IonSegment };

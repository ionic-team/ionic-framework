/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Text {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-text"; }
    static get host() { return { "theme": "text" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return ".text-ios-primary,\n.text-ios-primary a,\n.text-ios-primary p {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff)) !important;\n}\n\n.text-ios-secondary,\n.text-ios-secondary a,\n.text-ios-secondary p {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64)) !important;\n}\n\n.text-ios-tertiary,\n.text-ios-tertiary a,\n.text-ios-tertiary p {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942)) !important;\n}\n\n.text-ios-success,\n.text-ios-success a,\n.text-ios-success p {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60)) !important;\n}\n\n.text-ios-warning,\n.text-ios-warning a,\n.text-ios-warning p {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00)) !important;\n}\n\n.text-ios-danger,\n.text-ios-danger a,\n.text-ios-danger p {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d)) !important;\n}\n\n.text-ios-light,\n.text-ios-light a,\n.text-ios-light p {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4)) !important;\n}\n\n.text-ios-medium,\n.text-ios-medium a,\n.text-ios-medium p {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2)) !important;\n}\n\n.text-ios-dark,\n.text-ios-dark a,\n.text-ios-dark p {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222)) !important;\n}"; }
    static get styleMode() { return "ios"; }
}

export { Text as IonText };

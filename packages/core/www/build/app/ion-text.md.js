/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Text {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-text"; }
    static get host() { return { "theme": "text" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return ".text-md-primary,\n.text-md-primary a,\n.text-md-primary p {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff)) !important;\n}\n\n.text-md-secondary,\n.text-md-secondary a,\n.text-md-secondary p {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64)) !important;\n}\n\n.text-md-tertiary,\n.text-md-tertiary a,\n.text-md-tertiary p {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942)) !important;\n}\n\n.text-md-success,\n.text-md-success a,\n.text-md-success p {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60)) !important;\n}\n\n.text-md-warning,\n.text-md-warning a,\n.text-md-warning p {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00)) !important;\n}\n\n.text-md-danger,\n.text-md-danger a,\n.text-md-danger p {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d)) !important;\n}\n\n.text-md-light,\n.text-md-light a,\n.text-md-light p {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4)) !important;\n}\n\n.text-md-medium,\n.text-md-medium a,\n.text-md-medium p {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2)) !important;\n}\n\n.text-md-dark,\n.text-md-dark a,\n.text-md-dark p {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222)) !important;\n}"; }
    static get styleMode() { return "md"; }
}

export { Text as IonText };

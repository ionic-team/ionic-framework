/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Note {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-note"; }
    static get host() { return { "theme": "note" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return ".note-ios {\n  font-family: -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif;\n  color: var(--ion-text-ios-color-step-650, var(--ion-text-color-step-650, #a6a6a6));\n}\n\n.note-ios-primary {\n  color: var(--ion-color-ios-primary, var(--ion-color-primary, #488aff));\n}\n\n.note-ios-secondary {\n  color: var(--ion-color-ios-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.note-ios-tertiary {\n  color: var(--ion-color-ios-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.note-ios-success {\n  color: var(--ion-color-ios-success, var(--ion-color-success, #10dc60));\n}\n\n.note-ios-warning {\n  color: var(--ion-color-ios-warning, var(--ion-color-warning, #ffce00));\n}\n\n.note-ios-danger {\n  color: var(--ion-color-ios-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.note-ios-light {\n  color: var(--ion-color-ios-light, var(--ion-color-light, #f4f4f4));\n}\n\n.note-ios-medium {\n  color: var(--ion-color-ios-medium, var(--ion-color-medium, #989aa2));\n}\n\n.note-ios-dark {\n  color: var(--ion-color-ios-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "ios"; }
}

export { Note as IonNote };

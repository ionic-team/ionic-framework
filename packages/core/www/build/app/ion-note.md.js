/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Note {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-note"; }
    static get host() { return { "theme": "note" }; }
    static get properties() { return { "color": { "type": String, "attr": "color" }, "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return ".note-md {\n  font-family: \"Roboto\", \"Helvetica Neue\", sans-serif;\n  color: var(--ion-text-md-color-step-800, var(--ion-text-color-step-800, #cccccc));\n}\n\n.note-md-primary {\n  color: var(--ion-color-md-primary, var(--ion-color-primary, #488aff));\n}\n\n.note-md-secondary {\n  color: var(--ion-color-md-secondary, var(--ion-color-secondary, #32db64));\n}\n\n.note-md-tertiary {\n  color: var(--ion-color-md-tertiary, var(--ion-color-tertiary, #f4a942));\n}\n\n.note-md-success {\n  color: var(--ion-color-md-success, var(--ion-color-success, #10dc60));\n}\n\n.note-md-warning {\n  color: var(--ion-color-md-warning, var(--ion-color-warning, #ffce00));\n}\n\n.note-md-danger {\n  color: var(--ion-color-md-danger, var(--ion-color-danger, #f53d3d));\n}\n\n.note-md-light {\n  color: var(--ion-color-md-light, var(--ion-color-light, #f4f4f4));\n}\n\n.note-md-medium {\n  color: var(--ion-color-md-medium, var(--ion-color-medium, #989aa2));\n}\n\n.note-md-dark {\n  color: var(--ion-color-md-dark, var(--ion-color-dark, #222));\n}"; }
    static get styleMode() { return "md"; }
}

export { Note as IonNote };

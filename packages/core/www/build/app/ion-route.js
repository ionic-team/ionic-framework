/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Route {
    constructor() {
        this.props = {};
    }
    static get is() { return "ion-route"; }
    static get properties() { return { "path": { "type": String, "attr": "path" }, "props": { "type": "Any", "attr": "props" }, "sel": { "type": String, "attr": "sel" } }; }
}

export { Route as IonRoute };

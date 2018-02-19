/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class RouteLink {
    static get is() { return "ion-route-link"; }
    static get properties() { return { "router": { "type": "Any", "attr": "router" }, "url": { "type": String, "attr": "url" } }; }
}

export { RouteLink as IonRouteLink };

/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class NavPush {
    push() {
        const nav = this.element.closest('ion-nav');
        if (nav) {
            const toPush = this.url || this.component;
            return nav.push(toPush, this.data);
        }
        return Promise.resolve(null);
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-nav-push"; }
    static get properties() { return { "component": { "type": "Any", "attr": "component" }, "data": { "type": "Any", "attr": "data" }, "element": { "elementRef": true }, "url": { "type": String, "attr": "url" } }; }
}

export { NavPush as IonNavPush };

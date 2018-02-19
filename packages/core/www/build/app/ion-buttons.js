/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Buttons {
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-buttons"; }
    static get host() { return { "theme": "bar-buttons" }; }
}

export { Buttons as IonButtons };

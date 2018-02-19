/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Reorder {
    componentDidLoad() {
        this.custom = this.el.childElementCount > 0;
    }
    hostData() {
        const hostClasses = {
            'reorder-custom': this.custom
        };
        return {
            class: hostClasses
        };
    }
    render() {
        // TODO: https://github.com/ionic-team/stencil/issues/171
        if (this.custom === true) {
            return h("slot", null);
        }
        else if (this.custom === false) {
            return h("ion-icon", { class: 'reorder-icon', name: 'reorder' });
        }
        else {
            return undefined;
        }
    }
    static get is() { return "ion-reorder"; }
    static get host() { return { "theme": "reorder" }; }
    static get properties() { return { "custom": { "state": true }, "el": { "elementRef": true } }; }
    static get style() { return ".reorder[slot] {\n  display: none;\n  line-height: 0;\n}\n\n.reorder-enabled .reorder {\n  display: block;\n  cursor: grab;\n  cursor: -webkit-grab;\n  pointer-events: all;\n  touch-action: none;\n}\n\n.reorder-selected,\n.reorder-selected .reorder {\n  cursor: grabbing;\n  cursor: -webkit-grabbing;\n}\n\n.reorder-selected {\n  position: relative;\n  z-index: 100;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);\n  opacity: .8;\n  transition: none !important;\n}\n\n.reorder-icon {\n  transform: translate3d(160%,  0,  0);\n  display: block;\n  font-size: 1.3em;\n  transition: transform 140ms ease-in;\n}\n\n.reorder-icon svg {\n  min-width: 1em;\n}\n\n.reorder[slot=\"start\"] .reorder-icon {\n  transform: translate3d(-160%,  0,  0);\n}\n\n.reorder-visible .reorder .reorder-icon {\n  transform: translate3d(0,  0,  0);\n}\n\n.item .reorder[slot] {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.reorder-md .reorder-icon {\n  font-size: 1.8em;\n  opacity: 0.3;\n}"; }
    static get styleMode() { return "md"; }
}

export { Reorder as IonReorder };

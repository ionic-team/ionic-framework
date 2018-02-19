/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Page {
    hostData() {
        return {
            class: {
                'ion-page': true
            }
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-page"; }
    static get style() { return ".hide,\n[hidden],\ntemplate {\n  display: none !important;\n}\n\n.sticky {\n  position: sticky;\n  top: 0;\n}\n\n.click-block {\n  display: none;\n}\n\n.click-block-enabled {\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  transform: translate3d(0,  -100%,  0) translateY(1px);\n  position: absolute;\n  z-index: 99999;\n  display: block;\n  opacity: 0;\n  contain: strict;\n}\n\n.click-block-active {\n  transform: translate3d(0,  0,  0);\n}\n\nion-page {\n  top: 0;\n  position: absolute;\n  z-index: 0;\n  width: 100%;\n  height: 100%;\n  contain: layout size style;\n}"; }
}

export { Page as IonPage };

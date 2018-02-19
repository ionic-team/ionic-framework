/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

class Backdrop {
    static get is() { return "ion-backdrop"; }
    static get host() { return { "theme": "backdrop" }; }
    static get properties() { return { "mode": { "type": "Any", "attr": "mode" } }; }
    static get style() { return "ion-backdrop {\n  left: 0;\n  top: 0;\n  position: absolute;\n  z-index: 2;\n  display: block;\n  width: 100%;\n  height: 100%;\n  opacity: .01;\n  transform: translateZ(0);\n  contain: strict;\n}\n\nion-backdrop.backdrop-no-tappable {\n  cursor: auto;\n}\n\n.backdrop-ios {\n  background-color: var(--ion-backdrop-ios-color, var(--ion-backdrop-color, #000));\n}"; }
    static get styleMode() { return "ios"; }
}

export { Backdrop as IonBackdrop };
